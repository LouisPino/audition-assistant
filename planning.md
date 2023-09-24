# Audition Assistant

Audition Assistant aims to reduce the time dedicated to managing your auditions so you can get straight o practicing.

## Links
[Planning Doc](https://docs.google.com/spreadsheets/d/1DrAsvPWn9esQvA_20tIJfcb2_JrnQtVv7zpNu1Cui-o/edit?usp=sharing)

## Wireframes

Don't exist yet

## Audition Model
| Property      | DataType |
| ----------- | ----------- |
| Orchestra             | String         |
| Location              | String         |
| Date                  | Date           |
| Excerpts              | ManyToMany     |
| User                  | FK-User        |
| Instruments           | ArrayField(choices)|

## Excerpt Model
| Property      | DataType       |
| -----------   | -----------    |
| title         | String         |
| Composer      | String         |
| Instrument    | Choices        |
|Goal Tempo type| Choices        |
|Goal Tempo val | Int            |
| Section       | String         |
| Current Tempo | Int            |
| Stick Choice  | String         |
| Audio         | String         |
| Start Time    | Time           |
| Last practiced| Date           |

## Notes Model
| Property    | DataType    |
| ----------- | ----------- |
| Excerpt     | FK-Excerpt  |
| Date        | Date        |
| Note        | String      |

## User Model
| Property    | DataType    |
| ----------- | ----------- |
| Username    | String      |
| password    | String      |


## User Stories
### MVP
**As a user, I want to:**
- ~~create an account so I can create and view audition lists~~
- ~~Track when the last time I practiced an excerpt was~~
- time my practice sessions to keep myself focused and remind myself to take breaks.
- view all excerpts in order of instrument or in order of last practiced
- be able to select previously input excerpts when creating new lists

### Icebox
**As a user, I want to:**
- plan and keep track of practice sessions
- ~~see spotify / youtube web player for my audio links. ~~
- Double stretch if it starts at the specified time. Double stretch generate a playlist on my spotify account with all these links. Triple Stretch if it finds these links automatically  based on excerpt title. 
- ~~integrated metronome~~