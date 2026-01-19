import os
import sys
import shutil
import uuid
import json
import torch
import numpy as np
import io
from collections import Counter
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from transformers import AutoTokenizer, AutoModel
from sklearn.cluster import HDBSCAN
from Bio import SeqIO
from huggingface_hub import snapshot_download


print("Initializing BioSentinel...")

def load_cpu_safe_model():
    checkpoint = "zhihan1996/DNABERT-2-117M"
    local_path = "./dnabert_local"
    
    if not os.path.exists(local_path):
        print("Downloading model...")
        snapshot_download(repo_id=checkpoint, local_dir=local_path)

    config_path = os.path.join(local_path, "config.json")
    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            config_data = json.load(f)
        
        config_data["use_flash_attn"] = False
        config_data["auto_map"] = {
            "AutoConfig": "configuration_bert.BertConfig",
            "AutoModel": "bert_layers.BertModel",
            "AutoModelForMaskedLM": "bert_layers.BertForMaskedLM"
        }
        
        with open(config_path, "w") as f:
            json.dump(config_data, f, indent=2)

    bert_layer_path = os.path.join(local_path, "bert_layers.py")
    if os.path.exists(bert_layer_path):
        with open(bert_layer_path, "r") as f: content = f.read()
        
  
        if "from .flash_attn_triton import" in content:
            content = content.replace(
                "from .flash_attn_triton import flash_attn_qkvpacked_func", 
                "flash_attn_qkvpacked_func = None # Patched"
            )
         
            content = content.replace(
                "from .flash_attn_triton import flash_attn_func", 
                "flash_attn_func = None # Patched"
            )
        
      
        content = content.replace("self.config.use_flash_attn", "False")
        
        with open(bert_layer_path, "w") as f: f.write(content)

    print("Configuration patched for CPU.")
    
    
    tokenizer = AutoTokenizer.from_pretrained(local_path, trust_remote_code=True)
    model = AutoModel.from_pretrained(local_path, trust_remote_code=True)
    
    return tokenizer, model


try:
    tokenizer, model = load_cpu_safe_model()
    device = torch.device("cpu")
    model.to(device)
    model.eval()
    print("AI Engine Ready.")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)


app = FastAPI()
UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_embeddings(sequences, batch_size=4):
    all_embeddings = []
    
    for i in range(0, len(sequences), batch_size):
        batch = sequences[i : i + batch_size]
        try:
            inputs = tokenizer(batch, return_tensors="pt", padding=True, truncation=True, max_length=512)
            inputs = {k: v.to(device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = model(**inputs)
               
                if isinstance(outputs, tuple):
                    hidden_states = outputs[0]
                else:
                    hidden_states = outputs.last_hidden_state
                
      
                attention_mask = inputs['attention_mask'].unsqueeze(-1).expand(hidden_states.size())
                sum_embeddings = torch.sum(hidden_states * attention_mask, 1)
                sum_mask = torch.clamp(attention_mask.sum(1), min=1e-9)
                mean_embeddings = sum_embeddings / sum_mask
                all_embeddings.append(mean_embeddings.cpu().numpy())
        except Exception as e:
            print(f"Embedding Error: {e}")
            
    return np.concatenate(all_embeddings, axis=0) if all_embeddings else np.array([])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
        
            data = await websocket.receive_text()
            
   
            if data.strip().startswith("@"): # FASTQ
                sequences = []
                try:
                    for record in SeqIO.parse(io.StringIO(data), "fastq"):
                        sequences.append(str(record.seq))
                except:
                    sequences = data.splitlines()
            else:
                sequences = [s.strip() for s in data.splitlines() if s.strip()]

            if len(sequences) < 2:
                await websocket.send_json({"error": "Send at least 2 sequences"})
                continue

            await websocket.send_json({"status": "processing", "msg": f"Processing {len(sequences)} reads..."})

          
            embeddings = get_embeddings(sequences)
            
        
            clusterer = HDBSCAN(min_cluster_size=2, metric='euclidean')
            labels = clusterer.fit_predict(embeddings)
            
            counts = dict(Counter(labels.tolist()))
            
          
            response = {
                "status": "complete",
                "total": len(sequences),
                "clusters": len(counts) - (1 if -1 in counts else 0),
                "anomalies": counts.get(-1, 0),
                "data": [{"cluster": int(l), "seq_idx": i} for i, l in enumerate(labels)]
            }
            await websocket.send_json(response)

    except WebSocketDisconnect:
        print("Disconnected")