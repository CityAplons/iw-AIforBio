import sqlite3 as sql
import pandas  as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import cPickle
def inverse_mutation(sequence,position,current):
    sequence = str(sequence)[:int(position)]+str(current)+str(sequence)[int(position)+1:]
    return sequence
def read_data(file_name):
    conn = sql.connect(file_name)
    cursor = conn.cursor()
    types = [str,str,int,str,float,float,float]
    names = ["sequence","current","position","mutation","ddG","PH","Temp"]
    results = {names[i]:[] for i in range(len(names))}
    for row in cursor.execute("SELECT * FROM dataset"):
        row = list(row)
        row[2] = str(int(row[2])-1)
        for i in range(len(names)):
            results[names[i]].append(types[i](row[i]))
    result = pd.DataFrame(results)
    conn.close()
    return result
def symmetry_add(data_set):
    inversed = data_set.copy()
    inversed.mutation,inversed.current = inversed.current.apply(lambda x:x),inversed.mutation.apply(lambda x:x)
    inversed['ddG'] = inversed.ddG.apply(lambda x: -x)
    inversed['sequence'] = inversed.apply(lambda x: inverse_mutation(x['sequence'],x['position'],x['current']),axis =1)
    return inversed.merge(data_set,how='outer')
def over_sampling(data_set):
    number_plus = len(data_set[data_set.ddG > 0])
    number_minus = len(data_set[data_set.ddG < 0])
    multiply = int(number_minus/number_plus)
    add = number_minus-number_plus*multiply
    plus = data_set[data_set.ddG > 0].copy()
    result = {y:map(lambda x: x[0],plus[[y]].values)*multiply+map(lambda x: x[0],plus[[y]].values)[:add] for y in map(str,plus.columns)}
    result = pd.DataFrame(result)
    all_else = data_set[data_set.ddG <=0].copy()
    return result.merge(all_else,how='outer')
def neighbour(sequence,position,shift):
    if (position + shift > len(sequence)-1 or position + shift < 0):
        return "0"
    else:
        return sequence[position+shift]
def test_true_false(label, true_label):
    count_true = 0
    count_all = 0
    for i in range(len(label)):
        count_all += 1
        if (np.sign(true_label[i]) == np.sign(label[i])):
            count_true += 1
    return float(count_true)/count_all
def test_symmetry(estimator,test_data,test_labels):
    columns = map(str,test_data.columns)
    inversed_test_data = test_data.copy()
    inversed_test_data.current,inversed_test_data.mutation = inversed_test_data.mutation.apply(lambda x: x),inversed_test_data.current.apply(lambda x: x)
    inversed_labels = estimator.predict(inversed_test_data)
    test_labels = np.array(test_labels)
    inversed_labels = np.array(inversed_labels)
    vector = test_labels+inversed_labels
    return np.sum(map(abs,vector))/len(vector)
def part_generator(sequence,index,number):
    length_part = int((len(sequence)-1)/(number-1))
    first = index*length_part
    last = min((index+1)*length_part - 1,len(sequence)-1)
    result = sequence[first:last+1]
    return result
def prepare_additional_features(data_set,param,model='neighbours'):
    if (model == 'neighbours'):
        number_neighbours = param[0]
        for i in range(1,number_neighbours+1):
            data_set['Left'+str(i)] = data_set.apply(lambda row: neighbour(row['sequence'],row['position'],-(i)),axis=1)
            data_set['Right'+str(i)] = data_set.apply(lambda row: neighbour(row['sequence'],row['position'],(i)),axis=1)
        inputting = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0'
        symbols = inputting.split(' ')
        numerics = [i for i in range(len(symbols))]
        categorical = ['current','mutation']+['Left'+str(i) for i in range(1,number_neighbours+1)]+['Right'+str(i) for i in range(1,number_neighbours+1)]
        for item in categorical:
            data_set[item] = data_set[item].apply(lambda x: numerics[symbols.index(x)])
        return data_set
    elif (model == 'parts'):
        number_parts = param[0]
        inputting = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'
        symbols = inputting.split(' ')
        for i in range(number_parts):
            data_set['part_'+str(i)] = data_set.apply(lambda row: part_generator(row['sequence'],i,number_parts),axis=1)
            for j in range(len(symbols)):
                data_set['part_'+str(i)+"_"+symbols[j]] = data_set['part_'+str(i)].apply(lambda row: row.count(symbols[j]),axis=1)
        return data_set
def calculate():
    #read dataset
    raw_data = read_data("iwdb.sqlite")
    #edit new features
    #shuffle data
    number_neighbours = 5
    raw_data = raw_data.sample(frac=1).reset_index(drop=True)
    raw_data = prepare_additional_features(raw_data,[number_neighbours],'neighbours')
    #change symbols in features to int values
    categorical = ['current','mutation']+['Left'+str(i) for i in range(1,number_neighbours+1)]+['Right'+str(i) for i in range(1,number_neighbours+1)]
    #make train and test data
    train_size = 1.
    size = int(len(raw_data)*train_size)
    train_data = raw_data.iloc[:size]
    test_data = raw_data.iloc[size:]
    train_data = symmetry_add(train_data)
    #train_data = over_sampling(train_data)
    train_labels = train_data['ddG'].values
    train_data = train_data.drop(['ddG','sequence'],axis=1)
    test_labels = test_data['ddG'].values
    test_data = test_data.drop(['ddG','sequence'],axis=1)
    #make foundation for pipeline
    regr = RandomForestRegressor(random_state = 0, max_depth = 20, n_estimators = 500)
    estimator = regr
    # make prediction
    estimator.fit(train_data,train_labels)
    #save
    with open('weights.pkl', 'wb') as fid:
        cPickle.dump(regr, fid)