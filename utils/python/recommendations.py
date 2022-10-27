import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys


df_netflix = pd.read_csv("~/documents/Coding/datasets/netflix/netflix_titles.csv")

def process_text(text):
  # replace multiple spaces with one
  text = ' '.join(text.split())
  # lowercase
  text = text.lower()
  return text

df_netflix['description'] = df_netflix.apply(lambda x: process_text(x.description),axis=1)
def clean_title(title):
  return re.sub("[^a-zA-Z0-9 ]", "", title)


df_netflix["clean_title"] = df_netflix["title"].apply(clean_title)
vectorizer = TfidfVectorizer(ngram_range=(1, 2))
tfidf = vectorizer.fit_transform(df_netflix["clean_title"])

def search(title):
  title = clean_title(title)
  query_vectorized = vectorizer.transform([title])
  similarity = cosine_similarity(query_vectorized, tfidf).flatten()
  indices = np.argpartition(similarity, -5)[-10:]
  results = df_netflix[["title", "cast", "release_year"]].iloc[indices][::-1]
  return results

actors = []
for row in df_netflix["cast"]:
  movie_actors = str(row).lower().replace(" ", "").split(",")
  actors.append(movie_actors[:4])
df_netflix["actors"] = actors

directors_list = []
for row in df_netflix["director"]:
  directors = str(row).lower().replace(" ", "").split(",")
  if directors[0] == "nan":
    directors[0] = ""
  directors_list.append(directors)
df_netflix["director_list"] = directors_list

genres = []
for row in df_netflix["listed_in"]:
  genre = str(row).lower()
  genres.append(genre)
df_netflix["genres"] = genres

countries = []
for row in df_netflix["country"]:
  country = str(row).lower()
  if country[0] == "nan":
    country[0] == ""
  countries.append(country)
df_netflix["countries"] = countries

# relative importance of different features
w_genres = 8
w_desription = 3
w_actors = 3
w_director = 10
w_country = 10

df_netflix['features'] = (df_netflix["genres"]*w_genres).astype(str) + " " + (df_netflix["description"]*w_desription) + " " + (df_netflix["actors"]*w_actors).astype(str) + " " + (df_netflix["director_list"]*w_director).astype(str) + " " + (df_netflix["countries"]*w_country).astype(str)

vect = CountVectorizer(stop_words='english')
vect_matrix = vect.fit_transform(df_netflix['features'])
cosine_similarity_matrix_count_based = cosine_similarity(vect_matrix, vect_matrix)

def add_score_to_df( index, df,cosine_similarity_matrix):
  similarity_scores = list(enumerate(cosine_similarity_matrix[index]))
  similarity_scores_sorted = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
  score = [t[1] for t in similarity_scores_sorted]
  index = [t[0] for t in similarity_scores_sorted]
  df["score"] = score
  df["index"] = index
  return df[["score", "index"]]

def get_score(df, movie_id):
  movie_score = df[(df["index"] == movie_id)]["score"]
  return movie_score

def get_best_movie_rec(movie_input_id_list, western):
  combined_df_list = [add_score_to_df(int(movie), df_netflix, cosine_similarity_matrix_count_based) for movie in movie_input_id_list]
  combined_top_list = [combined_df_list[i].head(6)["index"].tolist() for i in range(len(combined_df_list))]
  total_scores = []
  for top_list in combined_top_list:
    for movie in top_list[1:]:
      total_score = 0
      if western and df_netflix["country"].iloc[movie] == "India":
        continue
      if movie in movie_input_id_list:
        continue
      for single_df in combined_df_list:
        try:
          total_score += float(get_score(single_df, movie))
        except TypeError:
          continue
      total_scores.append({"movie_id": movie, "total_score": total_score})
  top_movies = sorted(total_scores, key=lambda x: x["total_score"], reverse=True)
  top_movies_list = [df_netflix.iloc[top_movies[i]["movie_id"]] for i in range(3)]
  output = [{"title": top_movies_list[i]["title"], "listed_in": top_movies_list[i]["listed_in"], "director": top_movies_list[i]["director"], "release_year": top_movies_list[i]["release_year"], "type": top_movies_list[i]["type"]} for i in range(3)]
  return output

if sys.argv[1] == "search":
  print(search(sys.argv[2]))

if sys.argv[1] == "recommend":
  movie_list = sys.argv[2:-1]
  western = sys.argv[-1]
  print(get_best_movie_rec(movie_list, western))
