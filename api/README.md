The RestfulAPI to work with algorithm.

To use it, you will need:
    - Python with packages: Flask, pandas, sklearn, numpy, venv
    0. Make sure that in folder there is current version of alghorithm file (weights.pkl)
    1. Create virtual enviroment: python -m venv env
    2. Activate enviroment: . venv/bin/activate
    3.  If you working on local network:    a) export FLASK_APP=server.py
                                            b) flusk run
        If you may work dedicated:          a) pip install gunicorn
                                            b) gunicorn -b :5000 -t 40 server:app  (Make sure that port 5000 forwarded)