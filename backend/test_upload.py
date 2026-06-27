import httpx
import asyncio
import os

async def upload_dataset():
    url = "http://localhost:8000/api/v1/upload/test-client"
    file_path = r"C:\RecruitGPT\dataset\[PUB] India_runs_data_and_ai_challenge\India_runs_data_and_ai_challenge\candidates.jsonl"
    
    if not os.path.exists(file_path):
        print("Dataset not found!")
        return

    print("Uploading candidates.jsonl...")
    
    with open(file_path, "rb") as f:
        files = {'file': ('candidates.jsonl', f, 'application/jsonl')}
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(url, files=files)
            print(f"Response Status: {response.status_code}")
            print(f"Response JSON: {response.json()}")

if __name__ == "__main__":
    asyncio.run(upload_dataset())
