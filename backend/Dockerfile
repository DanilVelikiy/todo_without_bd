FROM python

COPY requirements.txt requirements.txt
RUN python -m pip install --upgrade pip && pip install -r requirements.txt

WORKDIR /app

COPY wgsi.py wgsi.py
COPY app.py app.py
COPY data.json data.json

EXPOSE 5000

ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:5000", "wgsi:app"]