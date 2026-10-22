# About

This repository contains demonstration files for a STACK seminar/workshop entitled "A practical beginner guide to the STACK API", delivered on 22/10/26. The aim of the workshop is to introduce the STACK API, assuming familiarity with STACK, but no prior familiarity with the API. Participants will convert the demonstration notes, provided in tex format, to html notes with embedded sample stack questions using the STACK API through Docker.

# Repository contents

The folder `demo` contains the sample source materials to be used for the workshop:
* The file `Calc.tex` is the master text file for the demonstration course notes.
* The files within `Sections` are the individual sections of the course notes as tex snippets, loaded into the master `Calc.tex` via tex `input` commands.
* The `questions` folder contains a sample `calc.xml` file of STACK questions in Moodle XML format. This can be produced by exporting existing questions from an existing Moodle server.
* The 3 YAML files, and the files within the folders `filters` and `template` are largely forked from my [tex2html repository](https://github.com/samfearn/tex2html) (though contain some changes due to Pandoc updates that haven't made it back to that repository yet).
* The files `template/stackapicalls.js` and `stackjsvle.js` are used to communicate with the STACK API, and are based on ones from [the API folder within the main STACK repository](https://github.com/maths/moodle-qtype_stack/tree/master/api).

The seminar slides are also available in the root directory for later reference.

# Workshop Key Instructions

* Download a copy of this repository (either download as zip, or git clone, or ...).
* Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
* Open a terminal and navigate to the downloaded stack-seminar-api folder.
* Set up the Docker container, by running the command `docker compose -f docker-compose.yml up`.
* Check the server is running by browsing to `localhost:3080` in a web browser. You should be able to interact with some sample STACK questions.
* In the command terminal, navigate into the `demo` directory
* Convert the sample `Calc.tex` to markdown using the command `docker run --rm --volume "$(pwd):/data" --user $(id -u):$(id -g) pandoc/core:3.7 Calc.tex -d tex2md.yaml -o Calc.md`.
* Now we can insert a sample question into the markdown. Add the lines
 ```::: {.container-fluid .que .stack data-qid="1st order ODE -- Separable Explicit"}
 :::``` at the end of the first section, after the 3 examples (on line 80). 
* Convert the new `Calc.md` to html using the command `docker run --rm --volume "$(pwd):/data" --user $(id -u):$(id -g) pandoc/core:3.7 Calc.md -d md2html.yaml -o Calc.html -V questionsFile='questions/calc.xml'`.
* Check you can view the notes by browsing to `localhost:3080/app/Calc.html`.