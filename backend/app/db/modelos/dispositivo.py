from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.db.database import Base

class Dispositivo(Base):
    __tablename__ = "dispositivos"

    id: Mapped[str] = mapped_column(String, primary_key=True)