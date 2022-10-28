import pandas as pd
import numpy as np
import re
import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df_combined = pd.read_csv("~/documents/coding/datasets/searchfile.csv")


def clean_title(title):
  return re.sub("[^a-zA-Z0-9 ]", "", title)

df_combined["clean_title"] = df_combined["title"].apply(clean_title)

vectorizer = TfidfVectorizer(ngram_range=(1, 2))
tfidf = vectorizer.fit_transform(df_combined["clean_title"])

def search(title):
  title = clean_title(title)
  query_vectorized = vectorizer.transform([title])
  similarity = cosine_similarity(query_vectorized, tfidf).flatten()
  indices = np.argpartition(similarity, -5)[-7:]
  results = df_combined.iloc[indices][::-1]
  output = [{"title":df_combined["title"].iloc[i], "release_year": int(df_combined["release_year"].iloc[i]), "cast": str(df_combined["cast"].iloc[i])[:75] + "...", "index": int(i)} for i in indices[::-1]]
  return json.dumps(output, allow_nan=True)

title = sys.argv[1:]
print(search(" ".join(title)))