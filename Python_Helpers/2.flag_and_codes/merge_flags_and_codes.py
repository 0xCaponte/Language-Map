import json
import re

def is_valid_flag_emoji(flag):
    """Check if the string is a valid flag emoji."""
    return bool(re.match(u'[\U0001F1E6-\U0001F1FF]{2}', flag))

def merge_json_files(file_a, file_b, file_c):
    try:
        with open(file_a, 'r', encoding='utf-8') as a_file:
            data_a = json.load(a_file)
        
        with open(file_b, 'r', encoding='utf-8') as b_file:
            data_b = json.load(b_file)

        b_dict = {item['name']['common']: item for item in data_b}

        for item_a in data_a:
            common_name = item_a['name']['common']
            match = b_dict.get(common_name)

            if match:
                cca2 = match.get('cca2', 'N/A')
                item_a['cca2'] = cca2
                
                flag = match.get('flag', 'N/A')
                item_a['flag'] = flag

                if not is_valid_flag_emoji(flag):
                    print(f"Invalid flag emoji for {common_name}: {flag}")
                if not cca2:
                    print(f"Missing caa2 code for {common_name}")
            else:
                print(f"No matching entry found for {common_name} in File B")

        with open(file_c, 'w', encoding='utf-8') as c_file:
            json.dump(data_a, c_file, ensure_ascii=False, indent=4)

        print(f"--- Merge completed ---")

    except Exception as e:
        print(f"An error occurred: {e}")

merge_json_files('countries.json', 'flags_codes.json', 'extended_countries.json')
