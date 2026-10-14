from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, String
from app.db.database import Base

class Dispositivo(Base):
    __tablename__ = "dispositivos"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    token: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    id_usuario: Mapped[str] = mapped_column(ForeignKey("usuarios.id"))