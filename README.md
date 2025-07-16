# Domain-Specific Medical Chatbot Using Generative AI and Semantic Retrieval Techniques<img width="468" height="24" alt="image" src="https://github.com/user-attachments/assets/b14eaa99-c4f6-4f12-aaaf-cb8806152696" />



# How to run?
### STEPS:


```bash
conda create -n medibot python=3.10 -y
```

```bash
conda activate medibot
```


### STEP 02- install the requirements
```bash
pip install -r requirements.txt
```


### Create a `.env` file in the root directory and add your Pinecone & openai credentials as follows:

```ini
PINECONE_API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
OPENAI_API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```


```bash
# run the following command to store embeddings to pinecone
python store_index.py
```

```bash
# Finally run the following command
python app.py
```

Now,
```bash
open up localhost:
```


### Techstack Used:

- Python
- LangChain
- Flask
- GPT
- Pinecone



# 7. Setup github secrets:

   - PINECONE_API_KEY
   - OPENAI_API_KEY

    
