import json
import logging
import sys

def convert_languages_in_file(input_file_path, output_file_path):
    """
    Reads JSON data from a file, converts the 'languages' key-value pairs to an array of language objects.

    Args:
    input_file_path (str): The path to the input JSON file.
    output_file_path (str): The path to the output JSON file where the modified data will be saved.
    """
    try:
        # Read the JSON data from the input file
        with open(input_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Convert the languages field
        for country in data:
            if 'languages' in country:
                languages_list = [{"language": lang, "percentage": None, "notes": None} for lang in country['languages'].values()]
                country['languages'] = languages_list

        # Write the modified data to the output file
        with open(output_file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)

        logging.info("Conversion successful. Data written to " + output_file_path)

    except Exception as e:
        logging.error("An error occurred: " + str(e))

if __name__ == "__main__":
    # Set up logging
    logging.basicConfig(level=logging.INFO)

    # Check if the correct number of arguments are provided
    if len(sys.argv) != 3:
        logging.error("Usage: python script.py <input_file_path> <output_file_path>")
        sys.exit(1)

    # Extract file paths from command line arguments
    input_file_path = sys.argv[1]
    output_file_path = sys.argv[2]

    # Call the function with the provided file paths
    convert_languages_in_file(input_file_path, output_file_path)
