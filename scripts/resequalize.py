import sqlite3
import os

def resequalize(db_path: str, language: str):
    """
    Renumbers column "seq" in database, limit by language order by ID
    """
    db = sqlite3.connect(db_path)
    cursor = db.cursor()
    
    cursor.execute("""
        SELECT id FROM words
        WHERE language = ?
        ORDER BY id ASC
    """, (language,))
    
    rows = cursor.fetchall()
    
    # Update sequence numbers
    for new_seq, (word_id,) in enumerate(rows, start=1):
        cursor.execute("""
            UPDATE words
            SET seq = ?
            WHERE id = ?
        """, (new_seq, word_id))
    
    db.commit()
    db.close()

if __name__ == "__main__":
    db_path = os.path.abspath("backend/src/database.sqlite")
    language = "de" 
    resequalize(db_path, language)
    print("Sequence numbers updated successfully.")
