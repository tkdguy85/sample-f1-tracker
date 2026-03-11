"""
app/main.py
FastAPI application entry point.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import create_db_and_tables
from .routers import teams, drivers, races, standings


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="F1 2026 Season Tracker API",
    version="1.0.0",
    description="Backend for the F1 2026 season tracker — manages teams, drivers, races, and session results.",
    lifespan=lifespan,
)

# ── CORS — allow the React dev server (and production origin) ─────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # CRA dev server
        "http://localhost:4173",   # Vite preview
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(teams.router)
app.include_router(drivers.router)
app.include_router(races.router)
app.include_router(standings.router)


@app.get("/", tags=["health"])
def health():
    return {"status": "ok", "api": "F1 2026 Tracker"}
