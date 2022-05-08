// The 5beam server is not currently up, so I'm creating a little "fake 5beam" that responds in the same way as 5beam without actually being connected to the server.

// This isn't a real database it's just a few hard-coded test levels.
const levelDatabase = [
	{
		id: 2,
		featured: false,
		name: "3 Stories, 3 switches, and two sides ig.",
		author: "A Jar of Copper Salts",
		description: "A puzzley level I made. It's kinda hard, so good luck solving it.",
		levels: [
			"3 Stories, 3 switches, and two sides ig.\n32,18,04,11,H\n................................................................\n...........................................................?.:.?\n.......................1.1.1.1.1.1.1.1..........................\n....................../B/B/B/B/B/B/B/B..........................\n.....}.}.}.............c...a.......a.Z..........................\n.......½...............d...b.......b.Z..........................\n.....0.0.0.............c...a.......a.Z.....................n.n.n\n....................../B/B/B/B/B/B/B/B/B........................\n.......................c...M...........a........................\n.......................d...N.....g.....b........................\n..................../B/B/B/B/B/B/B/B/B/B.................O.P.O.P\n...................m/B......................../B.?.?/B...P.....O\n.1.1.o.j.o........../B...............=............../B/B.O.....P\n/B/B...R............/B.o.j.o/B/B.<.<.<.</B........../B/B.P.....O\n/B/B/B/B/B......../B/B.¢.¢.¢/B/B/B/B/B/B/B/B/B/B/B.V/B/B/B...4.P\n/B/B/B/B/B/B/B/B/B/B/B....../B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/B/B/B.W/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n01,15.50,10.00,10\n02,12.50,13.00,10\n03,15.00,07.00,10\n46,24.50,12.23,03 5032\n00\n000000"
		]
	},
	{
		id: 3,
		featured: false,
		name: "Untitled level 3",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 4,
		featured: false,
		name: "Untitled level 4",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 5,
		featured: false,
		name: "Untitled level 5",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 6,
		featured: false,
		name: "Untitled level 6",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 7,
		featured: false,
		name: "Untitled level 7",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 8,
		featured: false,
		name: "Untitled level 8",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 9,
		featured: false,
		name: "Untitled level 9",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 10,
		featured: false,
		name: "Untitled level 10",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 11,
		featured: false,
		name: "Untitled level 11",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 12,
		featured: false,
		name: "Untitled level 12",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 13,
		featured: false,
		name: "Untitled level 13",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 14,
		featured: false,
		name: "Untitled level 14",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 15,
		featured: false,
		name: "Untitled level 15",
		author: "Guest",
		description: "My epic level B)",
		levels: [
			"Time to explore\n32,18,01,00,L\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n...........................4....\n666......................////.:.\n//6666........5...../////////>>>\n/////6666.....//////////////////\n////////////////////////////////\n////////////////////////////////\n////////////////////////////////\n01,03.50,00.00,10\n06\n00S Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!\n00S Uh... well, um... uh.... gosh, I'm so confused.\n00H Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I...\n00S ...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!\n00S Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on.\n99S Use the arrow keys to move and press the space bar to jump.\n000000"
		]
	},
	{
		id: 36,
		featured: false,
		name: "Well",
		author: "A Jar of Copper Salts",
		description: "this is a level that I made. I think it's pretty alright.",
		levels: [
			"Well\n33,39,04,11,H\n.:................................................................\n..................................................................\n..................................................................\n.........................................................m.m.m....\n..................................................................\n..................................................................\n...................€.€............................................\n.......c.........€.€.€.€..........................................\n.................©.....©..........................................\n/B/B.............©.....©..........................................\n/B/B/B/B/B/B.....©.....©..........................................\n/B/B/B/B/B/B/B/B/B.z.z/B/B/B/B.................k.l.k.l............\n/B/B/B/B/B/B/B/B/B..../B/B/B/B/B/B/B.¡.¡.>.>.>.1.1.1.1.\..........\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B..../B/B/B/B/B/B/B.2..........\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B..../B/B/B/B/B/B/B.2.......3/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B..../B/B/B/B/B/B/B.2.n.n.n.3/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B..../B/B/B/B/B/B/B.2.......3/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B..../B/B/B/B/B/B/B.2.n.n.n.3/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B....../B/B/B/B/B/B/B.2...g...3/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B....../B/B/B/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B............/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B............../B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B............../B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B.W/B.`....../B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B/B/B/B....../B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B/B/B/B......../B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B/B/B/B......../B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B/B/B/B/B......../B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B/B/B/B/B.............O.a..../B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/B/B/B/B/B/B/B/B/B...........P.b..../B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/A/A/A/A/A/A.a...............O.a..../B\n/B/B/B/B/B/B/B/B/B/A/A/B/B/B/A/A/A/A/A/A.b.....`.....`...P.b...4/B\n/B/B/B/B/B/B/B/B/B/A/A/A/B/B/A/A/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/A/A/A/A/A/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/A/A/A/A/A/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/A/A/A/A/A/A/A/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B.V/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B/B\n02,14.50,08.00,10\n01,10.00,06.00,10\n03,11.50,07.00,10\n38,29.50,03.00,06\n00\n000000"
		]
	}
];

// function getLevel (id, data=false) {
	//
// }

function getLevelPage (page, sort="0A", amount=8, data=false) {
	var returnJSON = [];
	for (var i = amount*page; i < amount*(page+1) && i < levelDatabase.length; i++) {
		returnJSON.push(levelDatabase[i]);
	}
	return returnJSON;
}