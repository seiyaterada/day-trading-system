FROM python:latest
WORKDIR /transactpy/
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
ADD transact.py /transactpy/
