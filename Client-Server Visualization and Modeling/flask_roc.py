from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)
api = Api(app)
CORS(app)

class ROC(Resource):
	def get(self, preprocessing, c):
		# preprocessing
		if(preprocessing == "Min_max_scaler"):
			scaler = MinMaxScaler()
		elif(preprocessing == "Standardization"):
			scaler = StandardScaler()
		else:
			print("Invalid Inpu! ")

		# standarlize train and test datasets
		X_train_standardized = scaler.fit_transform(X_train)
		X_test_standardized = scaler.transform(X_test)
		
		# model fitting
		model = LogisticRegression(C = float(c))
		model.fit(X_train_standardized, y_train)

		# roc 
		score = model.predict_proba(X_test_standardized)
		fprs, tprs, thresholds = roc_curve(y_test, score[:, 1], pos_label = 1)
		json_objects = []
		for fpr, tpr in zip(fprs, tprs):
			json_objects.append({"fpr":fpr, "tpr":tpr})
		return json_objects

api.add_resource(ROC, "/<string:preprocessing>/<float:c>")

if __name__ == '__main__':
	# load data
	df = pd.read_csv('data/transfusion.data')
	xDf = df.loc[:, df.columns != 'Donated']
	y = df['Donated']
	# get random numbers to split into train and test
	np.random.seed(1)
	r = np.random.rand(len(df))
	# split into train test
	X_train = xDf[r < 0.8]
	X_test = xDf[r >= 0.8]
	y_train = y[r < 0.8]
	y_test = y[r >= 0.8]
	app.run(debug=True)