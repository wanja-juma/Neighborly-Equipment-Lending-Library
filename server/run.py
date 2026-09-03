import os
import sys

# Ensure the server directory is in the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
if __name__ == '__main__':
    app.run(port=5555, debug=True)
