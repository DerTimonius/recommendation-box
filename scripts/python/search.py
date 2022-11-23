import pandas as pd
import numpy as np
import re
import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

# relative path for windows machines
current_path = os.path.dirname(__file__)
dir_name = "datasets"
filename = "searchfile.csv"
complete_path = os.path.join(current_path, dir_name, filename)
df_combined = pd.read_csv(complete_path)
# df_combined = pd.read_csv("~/Documents/Coding/datasets/searchfile.csv")



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

def display_results():
  title = sys.argv[1:]
  print(search(" ".join(title)))

if __name__ == "__main__":
  display_results()
