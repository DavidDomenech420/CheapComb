# 1. Empezamos con una base de Linux muy ligera que ya tiene Python 3.11 instalado.
FROM python:3.11-slim

# 2. Configuraciones de seguridad y rendimiento de Python:
# - PYTHONDONTWRITEBYTECODE: Evita que Python llene el contenedor de archivos basura (.pyc)
# - PYTHONUNBUFFERED: Asegura que los 'print()' salgan inmediatamente en los logs de Portainer
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Le decimos a Docker: "A partir de ahora, todo lo que hagamos será dentro de esta carpeta"
WORKDIR /app

# 4. Instalamos las herramientas del sistema necesarias (psycopg2 suele necesitar esto en Linux)
RUN apt-get update \
    && apt-get install -y gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 5. Copiamos PRIMERO solo el archivo de requerimientos. 
# Esto es un truco de rendimiento: si cambias tu código Python pero no instalas librerías nuevas,
# Docker saltará este paso al reconstruir y tardará 2 segundos en lugar de 2 minutos.
COPY requirements.txt .

# 6. Le decimos a Docker que instale las librerías de Python.
RUN pip install --no-cache-dir -r requirements.txt

# 7. Por último, copiamos el resto de tu código (main.py, la carpeta app, api.py...) dentro del contenedor.
COPY . .

# Fíjate que NO hay un comando CMD al final. 
# Lo dejamos en blanco a propósito porque usaremos esta misma imagen para dos cosas distintas
# (FastAPI por un lado y tu bucle infinito del Worker por otro) controlándolo desde Portainer.