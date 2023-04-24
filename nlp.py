import json
from spacy import load, displacy, explain

config = json.load(open("home/v6cardoso/config.json"))
nlp = load(config["spacyModulePath"])

docLocal = nlp('localidade, lugar, lugares, vila, zona, região, localização, espaço, território, ambiente, bioma')

def analysis(text):
    doc = nlp(text)
    values = []
    for chunk in doc.noun_chunks:
         print(chunk.root.text, " -> " , chunk.root.similarity(docLocal))
         if chunk.root.ent_type_ == 'LOC' or chunk.root.similarity(docLocal) >= 0.21:
            values.append(chunk.text)
    return values