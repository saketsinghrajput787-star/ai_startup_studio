import sqlite3
import os
from pathlib import Path
from datetime import datetime, timezone, timedelta

# Initialize database path
DB_DIR = Path(__file__).resolve().parent.parent.parent / "data"
DB_DIR.mkdir(exist_ok=True)
DB_PATH = DB_DIR / "analytics.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS idea_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            idea_text TEXT NOT NULL,
            created_at TEXT NOT NULL,
            category TEXT,
            generation_status TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def log_idea_request(idea_text: str, status: str, user_id: str = None, category: str = None):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        created_at = datetime.now(timezone.utc).isoformat()
        cursor.execute('''
            INSERT INTO idea_requests (user_id, idea_text, created_at, category, generation_status)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, idea_text, created_at, category, status))
        conn.commit()
        last_id = cursor.lastrowid
        conn.close()
        return last_id
    except Exception as e:
        print(f"Error logging idea request: {e}")
        return None


def get_idea_requests(
    page: int = 1,
    limit: int = 20,
    search: str = None,
    status: str = None,
    start_date: str = None,
    end_date: str = None
):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        query_conditions = []
        params = []

        if search:
            query_conditions.append("(idea_text LIKE ? OR category LIKE ? OR user_id LIKE ?)")
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])

        if status and status.upper() != "ALL":
            query_conditions.append("generation_status = ?")
            params.append(status.upper())

        if start_date:
            query_conditions.append("created_at >= ?")
            params.append(start_date)

        if end_date:
            query_conditions.append("created_at <= ?")
            params.append(end_date)

        where_clause = ""
        if query_conditions:
            where_clause = "WHERE " + " AND ".join(query_conditions)

        # Count total matching rows
        count_sql = f"SELECT COUNT(*) FROM idea_requests {where_clause}"
        cursor.execute(count_sql, params)
        total_count = cursor.fetchone()[0]

        # Calculate pagination
        offset = (page - 1) * limit
        data_sql = f"""
            SELECT id, user_id, idea_text, created_at, category, generation_status
            FROM idea_requests
            {where_clause}
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT ? OFFSET ?
        """
        cursor.execute(data_sql, params + [limit, offset])
        rows = [dict(row) for row in cursor.fetchall()]

        conn.close()

        total_pages = (total_count + limit - 1) // limit if limit > 0 else 1

        return {
            "items": rows,
            "total": total_count,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }
    except Exception as e:
        print(f"Error fetching idea requests: {e}")
        return {
            "items": [],
            "total": 0,
            "page": page,
            "limit": limit,
            "total_pages": 1
        }


def get_idea_stats():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        now = datetime.now(timezone.utc)
        today_start = now.strftime("%Y-%m-%d") + "T00:00:00"
        
        # Calculate start of this week (Monday)
        from datetime import timedelta
        week_start = (now - timedelta(days=now.weekday())).strftime("%Y-%m-%d") + "T00:00:00"

        # Total ideas
        cursor.execute("SELECT COUNT(*) FROM idea_requests")
        total_ideas = cursor.fetchone()[0]

        # Ideas today
        cursor.execute("SELECT COUNT(*) FROM idea_requests WHERE created_at >= ?", (today_start,))
        ideas_today = cursor.fetchone()[0]

        # Ideas this week
        cursor.execute("SELECT COUNT(*) FROM idea_requests WHERE created_at >= ?", (week_start,))
        ideas_this_week = cursor.fetchone()[0]

        # Success vs Failed
        cursor.execute("SELECT COUNT(*) FROM idea_requests WHERE generation_status = 'SUCCESS'")
        successful_ideas = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM idea_requests WHERE generation_status = 'FAILED'")
        failed_ideas = cursor.fetchone()[0]

        # Categories breakdown
        cursor.execute("""
            SELECT COALESCE(category, 'General Tech / Uncategorized') as cat, COUNT(*) as count
            FROM idea_requests
            GROUP BY cat
            ORDER BY count DESC
            LIMIT 6
        """)
        top_categories = [{"category": row["cat"], "count": row["count"]} for row in cursor.fetchall()]

        # Recent 5 requests preview
        cursor.execute("""
            SELECT id, user_id, idea_text, created_at, category, generation_status
            FROM idea_requests
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT 5
        """)
        recent_ideas = [dict(row) for row in cursor.fetchall()]

        conn.close()

        return {
            "total_ideas": total_ideas,
            "ideas_today": ideas_today,
            "ideas_this_week": ideas_this_week,
            "successful_ideas": successful_ideas,
            "failed_ideas": failed_ideas,
            "top_categories": top_categories,
            "recent_ideas": recent_ideas
        }
    except Exception as e:
        print(f"Error computing idea stats: {e}")
        return {
            "total_ideas": 0,
            "ideas_today": 0,
            "ideas_this_week": 0,
            "successful_ideas": 0,
            "failed_ideas": 0,
            "top_categories": [],
            "recent_ideas": []
        }


# Initialize the database when the module is imported
init_db()

