from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Integer, String
from app.db.database import Base
from pydantic import BaseModel

class DispositivoInput(BaseModel):
    token: str
    id_usuario: str

class Dispositivo(Base):
    __tablename__ = "dispositivos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    token: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    id_usuario: Mapped[str] = mapped_column(ForeignKey("usuarios.id"))

    usuario = relationship(
        "Usuario", 
        back_populates="dispositivos"
        )