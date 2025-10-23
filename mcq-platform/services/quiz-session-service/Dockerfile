# syntax=docker/dockerfile:1
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY src/ ./src/

# Install quiz-session-service dependencies when requirement files are available.
# RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "-m", "src.app.main"]
