from flask import * #flask
import predictor
app = Flask(__name__)

@app.route('/sendData', methods=['POST'])
def send():
	if request.method == 'POST':
		req_data = request.get_json()
		secret = req_data['secret']
		sequence = req_data['sequence']
		position = req_data['position']
		wildtype = req_data['wildtype']
		mutation = req_data['mutation']
		ph = req_data['ph']
		temp = req_data['temp']
		if secret == "SKOLTECH":
			if sequence[int(position)-1] == wildtype:
				result = predictor.prediction(sequence,wildtype,position,mutation,ph,temp)
				return jsonify(answer=result)
			else:
				return jsonify(answer='Bad sequence or position')
		else:
			return Response('Forbidden', status=403)

@app.route('/ping')
def ping():
	return jsonify(answer='pong')
