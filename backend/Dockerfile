FROM python:3.12-slim-bookworm

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ python3-dev \
    && rm -rf /var/lib/apt/lists/*

# # Upgrade pip + increase timeout and retries
# RUN pip install --upgrade pip setuptools wheel
# RUN pip install --upgrade pip

# COPY wheels /wheels
COPY requirements.txt .

# RUN pip install --no-cache-dir --find-links=/wheels -r requirements.txt

# RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

RUN pip install --no-cache-dir \
    --timeout=120 \
    --retries=5 \
    -r requirements.txt

# RUN pip install --no-cache-dir -r requirements.txt


COPY . .

# EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]