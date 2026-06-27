from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as core_router
from api.job_routes import router as job_router

app = FastAPI(
    title="RecruitGPT Enterprise API",
    description="Backend Data Intelligence Layer for RecruitGPT",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(core_router)
app.include_router(job_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
