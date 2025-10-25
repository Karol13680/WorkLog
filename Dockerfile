# App
FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY app/package*.json ./ 
RUN npm install

COPY app/ .
RUN npm run build

# Server
FROM python:3.11-slim AS backend

WORKDIR /server

COPY server/ .

COPY --from=frontend-build /app/dist ./static

RUN pip install --no-cache-dir -r requirements.txt

# Final image
CMD ["python", "app.py"]
