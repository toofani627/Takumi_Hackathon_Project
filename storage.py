# peheli hackathn
from flask import Flask, jsonify, request
import time
import logging
from database import mera_os_ki_files, ek_dm_top_level_secret, get_system_load

app_engine = Flask(__name__)


def yaha_log_karo(msg):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"DEBUG [{timestamp}]: {msg}")

@app_engine.route("/ping")
def health():
    yaha_log_karo("Frontend is checking if I'm alive")
    load = get_system_load()
    return {"status": "running", "cpu_usage": load, "message": "honululu"}

@app_engine.route('/fetch_vfs_data', methods=['GET'])
def get_desktop_items():
    yaha_log_karo("Fetching VFS (Virtual File System) map")
    time.sleep(0.05)
    return jsonify(mera_os_ki_files)

@app_engine.route('/auth_gate', methods=['POST'])
def handle_login():
    yaha_log_karo("Login attempt detected at auth_gate")
    
    try:
        # Pulling raw data
        pakdo_data = request.get_json()
    
        if not pakdo_data or 'password' not in pakdo_data:
            return jsonify({"status": "error", "reason": "Data gayab hai"}), 400

        piche_ka_password = pakdo_data.get('password')

        if piche_ka_password == ek_dm_top_level_secret:
            yaha_log_karo("Access granted. User is in.")
            return jsonify({
                "authorized": True,
                "token": "session_active_992",
                "ui_config": "windows_default"
            })
        else:
            yaha_log_karo("Access denied. Wrong pass.")
            return jsonify({
                "authorized": False,
                "msg": "Marunga Ek Lappad." 
            }), 401

    except Exception as fatal_error:
    
        yaha_log_karo(f"CRITICAL SYSTEM FAILURE: {str(fatal_error)}")
        return jsonify({"err": "System crash, call bhaiya"}), 500

if __name__ == "__main__":
   
    app_engine.run(host='0.0.0.0', port=5000, debug=True)