from flask import Blueprint, request, jsonify
from extensions import db
from models import BorrowingRequest

borrowing_requests_bp = Blueprint("borrowing_requests", __name__, url_prefix="/borrowing-requests")
