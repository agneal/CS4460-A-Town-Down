import json
oldData = open("data.json")

jOldData = json.load(oldData)
 
newData = {}

for yearStateOLD in jOldData:
	curYear = yearStateOLD["Year"]
	if not curYear in newData:
		newData[curYear] = {}
	yearStateNEW = {}

	for key in yearStateOLD:
		if key != "Year" and key != "State":
			yearStateNEW[key] = yearStateOLD[key]
	yearStateNEW["Name"] = yearStateOLD["State"]
	newData[curYear][yearStateOLD["State"]] = yearStateNEW



jNewData = open("data_new.json", "w")

json.dump(newData, jNewData)

jNewData.close()
oldData.close()