FROM python:3.8-slim-buster
WORKDIR /transact/
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
ADD transact.py /transact/