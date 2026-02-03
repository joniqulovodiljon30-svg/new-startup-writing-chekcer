import requests
from bs4 import BeautifulSoup
import json
import time
import random
import os

# Create data directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Ma'lumotlarni yig'ish uchun bo'sh ro'yxat
all_data = []

# Writing9 da taxminan 100+ sahifa bor. Biz 1 dan 50 gacha bo'lganini olib turamiz (sinov uchun)
# 1000 ta savol uchun range(1, 100) qilib ko'paytirasiz
BASE_URL = "https://writing9.com/ielts-writing-task-2"

def get_essay_content(essay_url):
    try:
        response = requests.get(essay_url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Savol matnini topish (Sayt o'zgarishi mumkin, classlarni tekshirish kerak)
            question = soup.find('h1').text.strip() if soup.find('h1') else "No Title"
            
            # Band 7+ javobni topish (Odatda birinchi javob eng yuqori baholangan bo'ladi)
            # Saytda essay contenti odatda 'content' yoki maxsus class ichida bo'ladi
            # essay_body = soup.find('div', class_='Post_content__...') # Bu yerni Inspect qilib aniqlash kerak
            
            # Attempt to find content by common patterns if specific class isn't known/stable
            essay_body = None
            # Try finding the main content div - often has 'content' in class or id
            # This is a heuristic; actual structure might vary
            possible_content = soup.find_all('div', string=lambda text: text and len(text) > 200)
            
            # Fallback: get all paragraph text
            if not essay_body:
                paragraphs = soup.find_all('p')
                full_text = "\n\n".join([p.text for p in paragraphs if len(p.text) > 50])
                return question, full_text
            
            return question, essay_body.text.strip()
    except Exception as e:
        print(f"Xatolik: {e}")
    return None, None

print("Scraping boshlandi... Iltimos kuting, bu biroz vaqt oladi.")

# Sahifalarni aylanamiz
# Reducing range for initial test to be faster, user can increase it later
for page in range(1, 4): 
    print(f"Processing Page {page}...")
    url = f"{BASE_URL}?page={page}"
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            # Har bir savolga kirish linklarini topamiz
            links = soup.find_all('a', href=True)
            
            for link in links:
                href = link['href']
                # Faqat essay linklarini filterlab olamiz
                if '/text/' in href: 
                    full_link = f"https://writing9.com{href}"
                    
                    question, model_answer = get_essay_content(full_link)
                    
                    if question and model_answer and len(model_answer) > 200:
                        data = {
                            "id": str(len(all_data) + 1),
                            "category": "General", # Buni keyin AI bilan saralash mumkin
                            "title": question[:50] + "...",
                            "questionText": question,
                            "modelAnswer": model_answer, # Band 7+ deb hisoblaymiz
                            "tips": ["Plan your essay", "Use linking words", "Check grammar"]
                        }
                        all_data.append(data)
                        print(f"Topildi: {len(all_data)} ta essay")
                        
                    # Sayt bizni bloklamasligi uchun biroz kutamiz
                    time.sleep(random.uniform(0.5, 1.5))
        
        else:
            print(f"Sahifa yuklanmadi: {url}")
            
    except Exception as e:
        print(f"Page processing error: {e}")

# Natijani JSON faylga saqlaymiz
output_path = 'data/writing9_dump.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print(f"TUGADI! Jami {len(all_data)} ta savol '{output_path}' fayliga saqlandi.")
