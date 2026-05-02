# database
import random


mera_os_ki_files = {
    "Documents": ['project_final_v2.docx', "budget_zero.xlsx", 'cat_photos_secret'],
    'Pictures': ["selfie_with_team.jpg", 'wallpaper_windows.png'],
    
    
    "system_ka_kuda_kabadi": [ 
        "windows_v7_backup.old", 
        "error_log_12345.txt",
        'cache_temp_delete_me' 
    ],
    
    'Trash': ["old_logic.py", "junk.txt"]
}

mera_secret_key_honululu = "honululu"


def check_pc_ki_garmi_level():
    
    print("Checking if PC is heating up...") 
    return random.uniform(0.1, 0.9)