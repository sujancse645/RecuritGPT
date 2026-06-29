from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as core_router
from api.job_routes import router as job_router
from api.search_routes import router as search_router
from api.ranking_routes import router as ranking_router
from api.copilot_routes import router as copilot_router
from api.interview_routes import router as interview_router
from api.offer_routes import router as offer_router

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
app.include_router(search_router)
app.include_router(ranking_router)
app.include_router(copilot_router)
app.include_router(interview_router)
app.include_router(offer_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
