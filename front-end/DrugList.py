import requests
import json

# # Function to fetch data for a given letter and return it as JSON
# def fetch_data(letter):
#     url = f"https://www.medscape.com/api/quickreflookup/LookupService.ashx?q={letter}&sz=50&metadata=has-interactions"
#     response = requests.get(url)
#     if response.status_code == 200:
#         return response.json()
#     else:
#         return None

# # Fetch data for all letters A to Z
# all_data = {}
# for letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
#     data = fetch_data(letter)
#     if data:
#         all_data[letter] = data

# # Write data to a JSON file
# with open("drugs.json", "w") as json_file:
#     json.dump(all_data, json_file, indent=2)

# ----------------------------------------------------------------

# # Load data from JSON file
# with open("drugs.json", "r") as json_file:
#     all_data = json.load(json_file)

# # Function to extract references
# def extract_references(data):
#     all_references = []
#     for letter, data in data.items():
#         for type_info in data.get("types", []):
#             for reference in type_info.get("references", []):
#                 all_references.append(reference)
#     return all_references

# # Extract all references
# all_references = extract_references(all_data)

# # Store references in a JSON object
# references_json = {"references": all_references}

# # Write references to a JSON file
# with open("all_references.json", "w") as json_output_file:
#     json.dump(references_json, json_output_file, indent=4)

# ----------------------------------------------------------------
    
# Function to load JSON data from file
def load_json_from_file(file_path):
    with open(file_path, "r") as json_file:
        data = json.load(json_file)
    return data

# Function to generate SQL insert statements
def generate_sql_insert(json_objects):
    sql_statements = []
    for obj in json_objects:
        sql = f"INSERT INTO drugs (id, drug_name, drug_category, drug_type_id) VALUES ({obj['id']}, '{obj['text']}', '{obj['val']}', {obj['type']});"
        sql_statements.append(sql)
    return sql_statements

# Load JSON data from file
json_file_path = "drugs2.json"
json_objects = load_json_from_file(json_file_path)

# Generate SQL insert statements
sql_insert_statements = generate_sql_insert(json_objects)

# Write SQL insert statements to a SQL file
with open("insert_drug.sql", "w") as sql_file:
    for sql_statement in sql_insert_statements:
        sql_file.write(sql_statement + "\n")