from spacy import load, displacy, explain


nlp = load("venv/Lib/site-packages/pt_core_news_sm/pt_core_news_sm-3.5.0")
#nlp = load("venv/Lib/site-packages/pt_core_news_lg/pt_core_news_lg-3.5.0")
#nlp = load("venv/Lib/site-packages/en_core_web_sm/en_core_web_sm-3.5.0")

def analysis(text):
    doc = nlp(text)
    return [chunk.text for chunk in doc.noun_chunks]


#print(analysis('Os aventureiros entraram em uma caverna escura no Japão e em Nova Iorque, joãozinho disse olhando para uma batata bonita vamos ao vilarejo no próximo final de semana'))