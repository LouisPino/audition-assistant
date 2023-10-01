# Audition Assistant
### Perfecting Practice, One Note at a Time
Introducing the ultimate companion for classical musicians! Our app is designed to elevate your practice sessions, offering a comprehensive practice journal to monitor progress, an audition planner to ensure you're always performance-ready, and an excerpt tracker to manage your repertoire with ease. Plus, stay on beat with our multifunctional metronome, tailored for the discerning musician. Perfect your artistry with precision and passion.

HOMEPAGE PHOTO HERE

## Getting Started
### [Deployed App](https://audition-assistant-2f2eaeaa2ec9.herokuapp.com/about/)

On your first entrance to Audition Assistant, click the **Sign Up** button to create an account.<br>

Once signed up, you will be logged in and brought to your the **Home Page**.<br>

From here you can access the built in **Metronome**, or navigate to the **Practice Journal** or **Auditions Dashboard**.


#### Metronome
METRONOME PHOTO HERE
- The metronome sidebar can be opened on any page by clicking **Metronome** in the navigation
- User may change the **time signature**, sonified with different pitched clicks
- User may play two voice **polyrhythms**
- User may adjust proibabilty of the  **random** function, which randomply plays a click or not based on probabilty
- User may **tap a tempo** to automatically set the metronome tempo

#### Practice Journal
JOURNAL PHOTO HERE
- User can keep a practice journal, detailing what they practiced and for how long
- This may be used as a planner, with the ability to mark practice tasks as completed throughout a session

#### Auditions and Excerpts
AUDITIONS/EXCERPTS PHOTOS HERE
- User may create a page to keep track of upcoming audition details
    - User may add excerpts to their audition which are then sorted by instrument and by time since last practiced
    - User may import excerpt from auditions previously created by an user
    - User may set goals for an audition and mark complete as appropriate
    <br>
- User may track details for each excerpt.
    - User may set goal and current practice tempi
    - User may log practice sessions, storing the date of the most recent session
    - User may add YouTube links to recordings, which automatically start at a user specified time
    - User may add notes to an excerpt to keep track of practice
    - User may add sheet music to an excerpt as pdf or image file
    - Open Opus API automatically provudes composer information for each excerpt
  


## Icebox Features
- Implement recording and playback in conjunction with metronome for pinpointing time inconsistencies in playing
- Port metronome to standalone mobile app
- Connect Spotify API to allow for Spotify playback and playlist creation for excerpt audio


## Technologies Used
- Python
- Django
- React
- JS
- HTML
- CSS
- Heroku
- Open Opus API
- Materialize
- Howler.js