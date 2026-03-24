# The DB file lives at ./f1.db (relative to where uvicorn is started).
from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = "sqlite:///./f1.db"

engine = create_engine(
  DATABASE_URL,
  echo=False,
  connect_args={"check_same_thread": False},  # needed for SQLite + FastAPI threads
)


def create_db_and_tables() -> None:
  """Called once at startup to create all tables if they don't exist."""
  SQLModel.metadata.create_all(engine)


def get_session():
  """FastAPI dependency — yields a DB session per request."""
  with Session(engine) as session:
    yield session
        