import json
from spacy import load, displacy, explain

config = json.load(open("home/v6cardoso/config.json"))
nlp = load(config["spacyModulePath"])

def analysis(text):
    doc = nlp(text)
    return [chunk.text for chunk in doc.noun_chunks]


#print(analysis('Os aventureiros entraram em uma caverna escura no Japão e em Nova Iorque, joãozinho disse olhando para uma batata bonita vamos ao vilarejo no próximo final de semana'))