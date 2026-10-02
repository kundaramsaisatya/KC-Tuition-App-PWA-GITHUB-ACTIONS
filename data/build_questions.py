import json, random
from pathlib import Path

names9=['Aarav','Meera','Kabir','Ishita','Rohan','Anaya','Ved','Myra','Aditya','Tara','Arjun','Nisha','Dev','Riya','Kunal','Sara','Manav','Kiara','Neil','Aanya','Yash','Diya','Om','Sia','Vivaan']
names10=['Rahul','Priya','Aman','Neha','Karan','Sneha','Rohan','Isha','Vikram','Anika','Sahil','Pooja','Nikhil','Tanvi','Varun','Kavya','Harsh','Mahi','Aryan','Simran','Dhruv','Rhea','Amit','Jiya','Raj']

def di(std, i):
    if std==9:
        templates=[
            ('Riya said, "I am reading a story."','Change into indirect speech.'),
            ('Aman said, "I have finished my homework."','Change into indirect speech.'),
            ('Mother said to me, "Clean your room."','Change into indirect speech.'),
            ('The teacher said, "The earth moves around the sun."','Change into indirect speech.'),
            ('Neha said, "I will visit Pune tomorrow."','Change into indirect speech.'),
            ('Rahul said to his friend, "Please help me."','Change into indirect speech.'),
            ('Father said, "Do not waste water."','Change into indirect speech.'),
            ('Sia said, "We were playing in the garden."','Change into indirect speech.'),
            ('The boy said, "I can solve this sum."','Change into indirect speech.'),
            ('Meera said, "Where are you going?"','Change into indirect speech.'),
            ('The teacher said to Rohan, "Open your book."','Change into indirect speech.'),
            ('Kavya said, "I saw a rainbow yesterday."','Change into indirect speech.'),
            ('Grandmother said, "Honesty is the best policy."','Change into indirect speech.'),
            ('Arjun said to me, "Will you come with us?"','Change into indirect speech.'),
            ('Mother said, "I am preparing dinner now."','Change into indirect speech.'),
            ('The captain said, "We won the match."','Change into indirect speech.'),
            ('Nisha said to her brother, "Do not touch my notebook."','Change into indirect speech.'),
            ('The doctor said to the patient, "Take these medicines regularly."','Change into indirect speech.'),
            ('Dev said, "I may join the class late."','Change into indirect speech.'),
            ('The teacher said, "Work hard and be punctual."','Change into indirect speech.'),
            ('Sara said, "I have been waiting for you."','Change into indirect speech.'),
            ('Om asked me, "Did you complete the project?"','Change into indirect speech.'),
            ('The child said, "What a beautiful kite!"','Change into indirect speech.'),
            ('Father said to us, "Keep the door closed."','Change into indirect speech.'),
            ('Anaya said, "I was ill last week."','Change into indirect speech.')]
    else:
        templates=[
            ('Priya said, "I have completed the assignment."','Change into indirect speech.'),
            ('Aman said to me, "I will call you after I reach home."','Change into indirect speech.'),
            ('The teacher said, "If you work hard, you will succeed."','Change into indirect speech.'),
            ('Rhea said, "I had already finished the book before the test began."','Change into indirect speech.'),
            ('Father said to Rahul, "Why did you leave the lights on?"','Change into indirect speech.'),
            ('The principal said, "Students must maintain discipline."','Change into indirect speech.'),
            ('Neha said to her sister, "Please do not reveal the secret."','Change into indirect speech.'),
            ('Karan said, "I can solve the problem if I get some time."','Change into indirect speech.'),
            ('The scientist said, "Water boils at 100 degrees Celsius."','Change into indirect speech.'),
            ('The coach said to the players, "Practice regularly if you want to improve."','Change into indirect speech.'),
            ('Sneha asked me, "Have you submitted your application?"','Change into indirect speech.'),
            ('The teacher asked Riya, "Why were you absent yesterday?"','Change into indirect speech.'),
            ('Vikram said, "I had been waiting for an hour when the bus arrived."','Change into indirect speech.'),
            ('Mother said to me, "Remember to carry your identity card."','Change into indirect speech.'),
            ('The officer said, "We will investigate the matter carefully."','Change into indirect speech.'),
            ('Anika exclaimed, "What an amazing performance!"','Change into indirect speech.'),
            ('Sahil said, "I might attend the seminar tomorrow."','Change into indirect speech.'),
            ('Pooja said to Varun, "Could you explain this rule to me?"','Change into indirect speech.'),
            ('The doctor said to the patient, "You should avoid oily food."','Change into indirect speech.'),
            ('Harsh said, "I have been studying since morning."','Change into indirect speech.'),
            ('The manager said to the staff, "Submit the report before Friday."','Change into indirect speech.'),
            ('Simran asked, "Where had you kept the documents?"','Change into indirect speech.'),
            ('The teacher said, "Unless you revise, you may forget the rules."','Change into indirect speech.'),
            ('Raj said, "I wish I could travel around the world."','Change into indirect speech.'),
            ('Dhruv said to me, "Let us discuss the problem tomorrow."','Change into indirect speech.')]
    text,instruction=templates[i]
    return {'id':f'S{std}-DI-{i+1:03d}','type':'direct_to_indirect','text':text,'instruction':instruction,'marks':2,'difficulty':'medium' if i<12 else 'hard'}

hp9=[
('Choose the correct word: Please ___ the bell when you arrive.','ring','wring'),
('Choose the correct word: I can ___ the birds outside.','hear','here'),
('Choose the correct word: The baker sells fresh ___.','bread','bred'),
('Choose the correct word: The children walked ___ the river.','along','a long'),
('Choose the correct word: I ate a ___ of cake.','piece','peace'),
('Choose the correct word: The soldier showed great ___.','courage','courages'),
('Choose the correct word: We should keep the classroom ___.','neat','knit'),
('Choose the correct word: She wants to ___ a new dress.','buy','by'),
('Choose the correct word: The teacher asked us to ___ the answer.','write','right'),
('Choose the correct word: Please ___ the door gently.','close','clothes'),
]
hg9=[
('Use the two meanings of "bat" in sentences.','bat = a piece of sports equipment; bat = a flying mammal'),
('Use the two meanings of "bark" in sentences.','bark = sound of a dog; bark = outer covering of a tree'),
('Use the two meanings of "bank" in sentences.','bank = financial institution; bank = side of a river'),
('Use the two meanings of "match" in sentences.','match = a contest; match = a small stick used to make fire'),
('Use the two meanings of "light" in sentences.','light = not heavy; light = illumination'),
('Use the two meanings of "watch" in sentences.','watch = timepiece; watch = observe carefully'),
('Use the two meanings of "spring" in sentences.','spring = season; spring = jump upward'),
('Use the two meanings of "well" in sentences.','well = in good health; well = deep hole for water'),
('Use the two meanings of "fair" in sentences.','fair = just; fair = public exhibition'),
('Use the two meanings of "ring" in sentences.','ring = circular band; ring = sound of a bell'),
]
nv9=[
('Use "play" as a noun and as a verb.','noun: a drama or game; verb: take part in a game'),
('Use "answer" as a noun and as a verb.','noun: a reply; verb: respond to a question'),
('Use "dance" as a noun and as a verb.','noun: a performance; verb: move rhythmically'),
('Use "change" as a noun and as a verb.','noun: coins returned; verb: make different'),
('Use "walk" as a noun and as a verb.','noun: a walk; verb: move on foot'),
('Use "visit" as a noun and as a verb.','noun: a short stay; verb: go to see someone/place'),
('Use "help" as a noun and as a verb.','noun: assistance; verb: assist'),
('Use "drink" as a noun and as a verb.','noun: a beverage; verb: swallow liquid'),
('Use "watch" as a noun and as a verb.','noun: a timepiece; verb: observe'),
('Use "call" as a noun and as a verb.','noun: a phone call; verb: telephone or shout to someone'),
]
inf9=[
('Complete using an infinitive: I went to the library ___.','to study'),('Complete using an infinitive: She wants ___ the competition.','to win'),('Complete using an infinitive: We decided ___ early.','to leave'),('Complete using an infinitive: He hopes ___ a doctor.','to become'),('Complete using an infinitive: They came here ___.','to help'),('Complete using an infinitive: I forgot ___ the window.','to close'),('Complete using an infinitive: She learned ___ a bicycle.','to ride'),('Complete using an infinitive: We need ___ the room.','to clean'),('Complete using an infinitive: He promised ___ on time.','to arrive'),('Complete using an infinitive: I am happy ___.','to help'),]
ge9=[
('Identify the gerund: Swimming is good exercise.','Swimming'),('Identify the gerund: I enjoy reading books.','reading'),('Identify the gerund: She likes painting.','painting'),('Identify the gerund: Walking every morning keeps me fit.','Walking'),('Identify the gerund: They discussed going to the museum.','going'),('Identify the gerund: We enjoy playing chess.','playing'),('Identify the gerund: Singing makes her happy.','Singing'),('Identify the gerund: He avoided talking loudly.','talking'),('Identify the gerund: Cooking is my hobby.','Cooking'),('Identify the gerund: She is fond of dancing.','dancing'),]
al9=[
('Arrange alphabetically: mango, apple, banana, orange.','apple, banana, mango, orange'),('Arrange alphabetically: school, scholar, science, schedule.','schedule, scholar, school, science'),('Arrange alphabetically: train, tree, table, tiger.','table, tiger, train, tree'),('Arrange alphabetically: bright, bring, brick, bridge.','brick, bridge, bright, bring'),('Arrange alphabetically: chair, chalk, chance, chapter.','chair, chalk, chance, chapter'),('Arrange alphabetically: garden, game, gate, glass.','game, garden, gate, glass'),('Arrange alphabetically: flower, floor, flag, flame.','flag, flame, floor, flower'),('Arrange alphabetically: school, shop, sheep, shirt.','sheep, shirt, shop, school'),('Arrange alphabetically: river, road, room, rose.','river, road, room, rose'),('Arrange alphabetically: planet, place, plant, plate.','place, planet, plant, plate'),]

hp10=[
('Choose the correct word: The principal will ___ the new rule tomorrow.','announce','an ounce'),('Choose the correct word: We need to ___ the problem carefully.','solve','sole'),('Choose the correct word: The athlete won the ___ race.','principal','principle'),('Choose the correct word: The medicine had a positive ___.','effect','affect'),('Choose the correct word: Please ___ the invitation before Friday.','accept','except'),('Choose the correct word: The workers will ___ the old building.','demolish','demolished'),('Choose the correct word: She gave me useful ___.','advice','advise'),('Choose the correct word: The students stood in a straight ___.','line','lyne'),('Choose the correct word: The weather can ___ our plans.','affect','effect'),('Choose the correct word: He has a strong ___ in his abilities.','belief','believe'),]
hg10=[
('Use the two meanings of "issue" in sentences.','issue = topic/problem; issue = distribute or publish'),('Use the two meanings of "current" in sentences.','current = present time; current = flow of water/electricity'),('Use the two meanings of "novel" in sentences.','novel = new/unusual; novel = long fictional book'),('Use the two meanings of "object" in sentences.','object = thing; object = express disagreement'),('Use the two meanings of "conduct" in sentences.','conduct = behaviour; conduct = carry out/lead'),('Use the two meanings of "present" in sentences.','present = current time; present = gift or introduce'),('Use the two meanings of "record" in sentences.','record = stored account; record = store information'),('Use the two meanings of "project" in sentences.','project = planned task; project = estimate/throw forward'),('Use the two meanings of "refuse" in sentences.','refuse = rubbish; refuse = decline'),('Use the two meanings of "content" in sentences.','content = subject matter; content = satisfied'),]
nv10=[
('Use "record" as a noun and as a verb.','noun: a stored account; verb: write/store information'),('Use "present" as a noun and as a verb.','noun: a gift; verb: introduce or show'),('Use "project" as a noun and as a verb.','noun: planned task; verb: estimate or display'),('Use "object" as a noun and as a verb.','noun: thing; verb: disagree'),('Use "conduct" as a noun and as a verb.','noun: behaviour; verb: carry out'),('Use "permit" as a noun and as a verb.','noun: official document; verb: allow'),('Use "increase" as a noun and as a verb.','noun: rise; verb: become/make greater'),('Use "export" as a noun and as a verb.','noun: goods sold abroad; verb: send goods abroad'),('Use "import" as a noun and as a verb.','noun: goods brought in; verb: bring goods in'),('Use "progress" as a noun and as a verb.','noun: forward movement; verb: move forward'),]
inf10=[
('Complete using an infinitive: The committee agreed ___ the proposal.','to consider'),('Complete using an infinitive: She refused ___ the confidential file.','to disclose'),('Complete using an infinitive: They managed ___ the deadline.','to meet'),('Complete using an infinitive: He pretended ___ asleep.','to be'),('Complete using an infinitive: We expect ___ the results soon.','to receive'),('Complete using an infinitive: The teacher encouraged us ___ critically.','to think'),('Complete using an infinitive: She was the first student ___ the problem.','to solve'),('Complete using an infinitive: He worked hard ___ his goal.','to achieve'),('Complete using an infinitive: They agreed ___ the issue later.','to discuss'),('Complete using an infinitive: I would like ___ more about the topic.','to learn'),]
ge10=[
('Identify the gerund: Reading widely improves vocabulary.','Reading'),('Identify the gerund: She insisted on meeting the principal.','meeting'),('Identify the gerund: Solving puzzles develops logical thinking.','Solving'),('Identify the gerund: He is interested in learning French.','learning'),('Identify the gerund: They avoided discussing the matter.','discussing'),('Identify the gerund: Writing regularly improves expression.','Writing'),('Identify the gerund: We considered changing the schedule.','changing'),('Identify the gerund: Travelling teaches valuable lessons.','Travelling'),('Identify the gerund: She succeeded by working consistently.','working'),('Identify the gerund: Collecting stamps was his childhood hobby.','Collecting'),]
al10=[
('Arrange alphabetically: analysis, analogy, ancestor, annual.','analogy, analysis, ancestor, annual'),('Arrange alphabetically: education, edition, editor, effective.','edition, editor, education, effective'),('Arrange alphabetically: principle, principal, priority, private.','principal, principle, priority, private'),('Arrange alphabetically: grammar, gratitude, gradual, graphic.','gradual, grammar, graphic, gratitude'),('Arrange alphabetically: courage, courteous, course, court.','course, courteous, court, courage'),('Arrange alphabetically: reaction, reader, reason, reality.','reader, reality, reaction, reason'),('Arrange alphabetically: preserve, present, pressure, precise.','precise, present, preserve, pressure'),('Arrange alphabetically: responsible, response, result, resource.','resource, response, responsible, result'),('Arrange alphabetically: sentence, senior, sensible, separate.','sensible, senior, sentence, separate'),('Arrange alphabetically: theory, theme, therefore, thorough.','theme, theory, therefore, thorough'),]

def grammar_q(std, idx):
    groups=[hp9,hg9,nv9,inf9,ge9,al9] if std==9 else [hp10,hg10,nv10,inf10,ge10,al10]
    labels=['homophones','homographs','noun_verb','infinitive','gerund','alphabetical']
    subs=[]
    # Rotate 4 topics; each main question contains 4 different topics.
    start=(idx*2)%6
    for j in range(4):
        k=(start+j)%6
        pool=groups[k]
        item=pool[(idx+j*3)%len(pool)]
        subs.append({'type':labels[k],'prompt':item[0],'answer':item[1],'marks':1})
    return {'id':f'S{std}-GR-{idx+1:03d}','type':'grammar_mix','text':f'Grammar Practice {idx+1}: Answer all four subquestions.','instruction':'Answer all four subquestions using correct grammar, spelling and punctuation.','subquestions':subs,'marks':4,'difficulty':'medium' if idx<12 else 'hard'}


# Expand each standard's Direct -> Indirect pool to 50 using additional distinct sentences.
extra_di9=[
('Isha said, "I am feeling better today."','Change into indirect speech.'),('Kabir said, "I bought this book yesterday."','Change into indirect speech.'),('The teacher said to the class, "Please remain silent."','Change into indirect speech.'),('Mother asked me, "Have you eaten your lunch?"','Change into indirect speech.'),('The girl said, "I cannot find my pencil."','Change into indirect speech.'),('Rohan said, "We will meet after school."','Change into indirect speech.'),('The coach said, "Run two more laps."','Change into indirect speech.'),('Tara said, "My brother is studying now."','Change into indirect speech.'),('The shopkeeper said, "These apples are fresh."','Change into indirect speech.'),('Father asked, "Who broke the vase?"','Change into indirect speech.'),('The student said, "I forgot my notebook at home."','Change into indirect speech.'),('Grandfather said to me, "Always speak the truth."','Change into indirect speech.'),('Meera said, "I have never seen snow."','Change into indirect speech.'),('The librarian said, "Return the books on Monday."','Change into indirect speech.'),('Arjun asked, "Can I borrow your pen?"','Change into indirect speech.'),('The girl exclaimed, "How bright the stars are!"','Change into indirect speech.'),('The teacher said, "Practice makes a person perfect."','Change into indirect speech.'),('Nisha said, "I was waiting for the bus."','Change into indirect speech.'),('Mother said to Riya, "Do your work neatly."','Change into indirect speech.'),('The boy asked, "When will the match begin?"','Change into indirect speech.'),('Dev said, "I shall return before sunset."','Change into indirect speech.'),('The nurse said to the child, "Do not worry."','Change into indirect speech.'),('Sara said, "We have won the prize."','Change into indirect speech.'),('The principal said to the students, "Follow the school rules."','Change into indirect speech.'),('Anaya asked me, "Why are you late?"','Change into indirect speech.')]
extra_di10=[
('Priya said, "I will have completed the work by evening."','Change into indirect speech.'),('The teacher asked, "Have you understood the distinction?"','Change into indirect speech.'),('Aman said, "I had never visited the museum before."','Change into indirect speech.'),('The principal said to the students, "You must submit the forms today."','Change into indirect speech.'),('Neha said, "I cannot attend the meeting tomorrow."','Change into indirect speech.'),('The examiner said, "Read the instructions carefully before answering."','Change into indirect speech.'),('Rohan asked me, "Why have you changed your decision?"','Change into indirect speech.'),('The scientist said, "We are developing a new method."','Change into indirect speech.'),('Kavya said, "I would help you if I had enough time."','Change into indirect speech.'),('The coach asked the player, "Why did you miss practice?"','Change into indirect speech.'),('Father said, "I had warned you about the traffic."','Change into indirect speech.'),('The teacher said, "Do not depend entirely on memorisation."','Change into indirect speech.'),('Sahil said, "I have been preparing for this examination for months."','Change into indirect speech.'),('The manager said, "We may revise the schedule next week."','Change into indirect speech.'),('Anika asked, "Could you send me the report tonight?"','Change into indirect speech.'),('The judge said, "The evidence must be examined carefully."','Change into indirect speech.'),('Harsh said, "I was completing the assignment when the power failed."','Change into indirect speech.'),('The teacher said to Riya, "Explain how you reached this answer."','Change into indirect speech.'),('Simran exclaimed, "What a remarkable achievement!"','Change into indirect speech.'),('The officer said, "We had already informed the department."','Change into indirect speech.'),('Raj said, "I might apply for the scholarship this year."','Change into indirect speech.'),('The doctor advised me, "You should exercise regularly."','Change into indirect speech.'),('The speaker said, "Let us examine both sides of the issue."','Change into indirect speech.'),('Dhruv asked, "Where will the ceremony be held?"','Change into indirect speech.'),('The captain said, "We must remain calm under pressure."','Change into indirect speech.')]
for std, extra in [(9,extra_di9),(10,extra_di10)]:
    pass

bank={9:[],10:[]}
for std in [9,10]:
    extra=extra_di9 if std==9 else extra_di10
    di_items=[di(std,i) for i in range(25)]
    for j,(text,instruction) in enumerate(extra,1):
        di_items.append({'id':f'S{std}-DI-{25+j:03d}','type':'direct_to_indirect','text':text,'instruction':instruction,'marks':2,'difficulty':'hard'})
    # 50 grammar questions: rotate topic combinations and use the ten-item topic pools.
    gr_items=[grammar_q(std,i) for i in range(25)]
    for i in range(25,50):
        q=grammar_q(std,i%25)
        q['id']=f'S{std}-GR-{i+1:03d}'
        q['text']=f'Grammar Practice {i+1}: Answer all four subquestions.'
        # shift the source positions to create a different combination
        groups=[hp9,hg9,nv9,inf9,ge9,al9] if std==9 else [hp10,hg10,nv10,inf10,ge10,al10]
        labels=['homophones','homographs','noun_verb','infinitive','gerund','alphabetical']
        subs=[]
        start=(i*3)%6
        for j in range(4):
            k=(start+j*2)%6
            item=groups[k][(i+j*2)%10]
            subs.append({'type':labels[k],'prompt':item[0],'answer':item[1],'marks':1})
        q['subquestions']=subs
        gr_items.append(q)
    bank[std]=di_items+gr_items

# distribute 4 students per standard, 10 DI + 10 grammar each, unique main questions within each standard.
student_map={
'Shravya':(9,'P9A',0), 'Nihansa':(9,'P9B',1), 'Varshita':(9,'P9C',2), 'Dhristi':(9,'P9D',3),
'Anandi':(10,'P10A',0), 'Akshara':(10,'P10B',1), 'Rishabh':(10,'P10C',2), 'Riya':(10,'P10D',3)
}
papers={}
for name,(std,code,slot) in student_map.items():
    di_pool=bank[std][:50]
    gr_pool=bank[std][50:]
    starts=[0,10,20,30]
    chosen=di_pool[starts[slot]:starts[slot]+10]
    gchosen=gr_pool[starts[slot]:starts[slot]+10]
    papers[code]={'standard':std,'studentName':name,'questions':chosen+gchosen}

out={'metadata':{'title':'English Grammar Master Test 1','description':'Reusable 200-question bank: 100 for Std 9 and 100 for Std 10, with eight student-specific papers.','version':1},'questionBank':bank,'papers':papers}
Path('/mnt/data/work/ui-v4/data/question-bank-100.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
# self-contained import file containing only the eight papers
import_file={'title':'English Grammar Master Test 1','duration':60,'papers':papers}
Path('/mnt/data/work/ui-v4/data/English_Grammar_Test_1.json').write_text(json.dumps(import_file,indent=2,ensure_ascii=False))
