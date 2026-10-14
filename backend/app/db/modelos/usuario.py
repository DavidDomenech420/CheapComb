from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from app.db.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    dispositivos = relationship(
        "Dispositivo",
        back_populates="usuarios",
        cascade="all, delete-orphan"
    )