import pandas  as pd
import cPickle
import numpy as np

def load():
    with open('weights.pkl', 'rb') as fid:
        gnb_loaded = cPickle.load(fid)
    estimator = gnb_loaded
    return estimator
estimator = load()


def neighbour(sequence,position,shift):
    if (position + shift > len(sequence)-1 or position + shift < 0):
        return "0"
    else:
        return sequence[position+shift]
    if (position + shift > len(sequence)-1 or position + shift < 0):
        return "0"
    else:
        return sequence[position+shift]

def prediction(sequence,current,position,mutation,ph = 8.0,temp=37.):
    number_neighbours = 5
    columns = ['sequence','current','position','mutation','PH','Temp']
    data = [sequence,current,position,mutation,ph,temp]
    test_data = {columns[i]:[data[i]] for i in range(len(columns))}
    test_data = pd.DataFrame(test_data)
    for i in range(1,number_neighbours+1):
        test_data['Left'+str(i)] = test_data.apply(lambda row: neighbour(row['sequence'],row['position'],-(i)),axis=1)
        test_data['Right'+str(i)] = test_data.apply(lambda row: neighbour(row['sequence'],row['position'],(i)),axis=1)
    test_data = test_data.drop(['sequence'],axis=1)
    categorical = ['current','mutation']+['Left'+str(i) for i in range(1,number_neighbours+1)]+['Right'+str(i) for i in range(1,number_neighbours+1)]
    inputting = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0'
    symbols = inputting.split(' ')
    numerics = [i for i in range(len(symbols))]
    for item in categorical:
        test_data[item] = test_data[item].apply(lambda x: numerics[symbols.index(x)])
    result = estimator.predict(test_data)
    if result > 0.5:
        text = 'less stable'
    elif result >= -0.5:
        text = 'no change in stability'
    else:
        text = 'more stable'
    final_result = {'ddG': result[0], 'stability': text}
    return final_result