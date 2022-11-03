import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys
import json

# read the file into a pandas dataframe and delete the "index" column, since it will be added later (and more accurately)
df_combined = pd.read_csv("~/Documents/Coding/datasets/combined_test.csv")
df_combined.drop(["index"], axis=1, inplace=True)

def add_score_to_df( index, df,cosine_similarity_matrix):
  """
  get the score of each movie (or show) in comparison to the input index and sort it accordingly.
  afterwards add the score and the index to the dataframe and return both

  @params:
  index: integer, is the movie index
  df: dataframe, which is going to be used to add the score and index
  cosine_similarity_matrix: list of floats ranging from 0.0 to 1.0, from lowest similarity to highest (which would be the same movie/show as the input)
  """
  similarity_scores = list(enumerate(cosine_similarity_matrix[index]))
  similarity_scores_sorted = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
  score = [t[1] for t in similarity_scores_sorted]
  index = [t[0] for t in similarity_scores_sorted]
  df["score"] = score
  df["index"] = index
  return df[["score", "index"]]

def get_score(df, movie_id):
  """
  checks the score of the input and returns it
  """
  movie_score = df[(df["index"] == movie_id)]["score"]
  return movie_score

def get_best_movie_rec(movie_input_id_list, options, preferences):

  # Check the input options if only movies or tv shows should be checked
  if options == "movie":
    checked_df = df_combined.loc[df_combined["type"] == "Movie"]
    for movie in movie_input_id_list:
      if df_combined["type"].iloc[int(movie)] == "TV Show":
        checked_df = checked_df.append(df_combined.iloc[int(movie)])
  elif options == "tv":
    checked_df = df_combined.loc[df_combined["type"] == "TV Show"]
    for movie in movie_input_id_list:
      if df_combined["type"].iloc[int(movie)] == "Movie":
        checked_df = checked_df.append(df_combined.iloc[int(movie)])
  else:
    checked_df = df_combined

     # doing the vectorizing = comparing the field features of every row to get the best match
  vect = CountVectorizer(stop_words='english')
  vect_matrix = vect.fit_transform(checked_df['features'])
  cosine_similarity_matrix_count_based = cosine_similarity(vect_matrix, vect_matrix)
  # takes a list of movie/show ids, calls a function to create a list of differnt versions of the dataframe to compare the scores later.
  combined_df_list = [add_score_to_df(int(movie), checked_df, cosine_similarity_matrix_count_based) for movie in movie_input_id_list]
  # also, creates a list of the 6 most similar movies/shows, later deleting the first one, since that will always be the initial movie
  combined_top_list = [combined_df_list[i].head(20)["index"].tolist() for i in range(len(combined_df_list))]
  total_scores = []
  # looping through the lists:
  #  1. the list of movie list, 2. the movies in that list and 3. checking for the score of that movie in every dataframe version and adding together
  for top_list in combined_top_list:
    for movie in top_list[1:]:
      total_score = 0
      if bool(preferences.capitalize()) and df_combined["country"].iloc[movie] == "India":
        continue
      if str(movie) in movie_input_id_list:
        continue
      if (options == "movie" and df_combined["type"].iloc[movie] == "Movie") or (options == "tv" and df_combined["type"].iloc[movie] == "TV Show") or (options == "both"):
        for single_df in combined_df_list:
          try:
            total_score += float(get_score(single_df, movie))
          except TypeError:
            continue
        total_scores.append({"movie_id": movie, "total_score": total_score})
      else:
        continue
  # sort the movies according to their total score and return the top 3 in JSON format, so it can be read with JS later
  top_movies = sorted(total_scores, key=lambda x: x["total_score"], reverse=True)
  top_movies_list = [df_combined.iloc[top_movies[i]["movie_id"]] for i in range(3)]
  output = [{"title": top_movies_list[i]["title"], "listed_in": top_movies_list[i]["listed_in"], "director": str(top_movies_list[i]["director"]), "release_year": int(top_movies_list[i]["release_year"]), "type": top_movies_list[i]["type"], "description":top_movies_list[i]["description"]} for i in range(3)]
  return json.dumps(output, allow_nan=True)


movie_list = sys.argv[1:-2]
options = sys.argv[-2]
preferences = sys.argv[-1]
print(get_best_movie_rec(movie_list, options, preferences))