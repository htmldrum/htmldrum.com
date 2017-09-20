---
layout: post
title: Polyglot by default
summary: Encouraging Polyglot programming encourages discovering new problems but are you just rolling a rock up a hill?
categories: polyglot general
---

In essay *The Myth of Sisyphus* Albert Camus explores the futility of human effort in the presence of the eventual
heat death of the universe. When you strip human motivations and activities of the romanticism and propoganda of
common societal norms, what is the purpose of experience? In the presence of impending environmental collapse,
nuclear war and supersedence by electric constructions of our own consciousness, our labour seems moot.
Acceptance, escapism, validation; sort for in GitHub stars, conference apperances and retweets, disappear
instantaneously as each year introduces a new packaging subsystem, deployment model or language. As **technology**
grows to encompass *all* industries, we must ask ourselves if there is benefit in maintaing currency with technological
fads beyond the fear of unemployment through irrelevancy.

At The Globe Theatre in Elizabethan England, actors portraying royalty were instructed to be still. Their movement was
used as a cue for the  audience's respect. Characters engaging in idealogical conflict would pace and aside and be joined
with company in spotlight. Fraught wringing of hands, crestfallen torsos and saddled cheeks were the tole of the characters
bringing equipoise change. Voltaire captures this idea of the conflict between the rigid and the agitated in his quote *"History of
full of sounds of silk slippers going down stairs and wooden shoes going up."* As it is with IT, each development fad is less
so an 'advance', moreso the song of a fresh band of clog-marchers seeking validation and reward in exchange for a fresh set of
trade-offs for capital owners. I, too, was once a young clog-marcher but as I get older I have the sallow eyes of nights
debugging infernal machines and the burning tongue of the speaker of many languages. Whilst accepting that someday I, too, will be
retired for uselessness I wish to use my experience whilst I can.

Turing-equivalence and the Church-Turing thesis tells us that if it 2 constructions produce identical, to a sufficient approximation,
output, they are not more powerful than one another. [They might compute faster, perhaps, or use less memory, or their instruction
set might be smaller, but they cannot compute more powerfully.](https://en.wikipedia.org/wiki/Turing_machine_equivalents#Machines_equivalent_to_the_Turing_machine_model)
Thus, the role of the programmer is the wheel greaser for the machine chosen by the capitalistic construct. The mechanic who traded in
his garage for a shared office, his tools for a laptop and his overall for a hoodie and sneakers. However, in this Mephistophlean deal,
he has a choice. He may either grease the machine through the watery goo of his insides intercepting every instruction pointer or
by controlling the problem or the solution by judicious use of logic, mysticism or cunning. And it is in this right that he pokes futility
in the eye.

If the solutions to problems were clear, our tools would not exist. If the wording of the solution did not matter, only the
output of the compiler, we would not see problems shrink in the face of language change. We would not see more power requiring
fewer hands to manipulate it. In [OOP is Dead! Long Live OODD!](https://www.youtube.com/watch?v=RdE-d_EhzmA) David West talks about
the central importance of design in digital systems. Whilst loose on details, it reinforces a message that it is the role of the journeyman
programmer to embrace change and add each development to his arsenal. Programs and languages are ideas and ideas are our tools. I'm not
saying that programming is a young man's game: it is the eager man's. This is where I fear most for my own future, that I do not become
too jaded and cynical in the presence of fads before surcumbing to hurd mentality.

I do not like using React/Redux stacks. [They are a verbose jumble of cross-cutting concerns requiring mindfullness of the internals of components](http://redux.js.org/docs/basics/DataFlow.html#data-flow).
This zealotry for complexity is the mark of the clog-marcher: flagellating themselves for self-esteem, feeding themselves on flesh torn with
sharp comments. More generally, I do not like much of the Facebook tooling that the community forces upon me. [Flow has issues](https://github.com/facebook/flow/issues)
and it's impact isn't enough to convince me that JavaScript is appropriate for applications larger than a couple of hundred lines. Back when I
started web programming, all rendering was stateless - it was called the response body and you only got one shot at it. Before then, if you
couldn't organize your ActionScript ([AS2](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/2/help.html?content=Part1_Learning_AS2_1.html), that is) in a way that it could write to the canvas at 30fps you couldn't write flash games. I've written
lots of production applications in JavaScript and I've learnt that it's too losely typed, encourages too much testing, is too inflexible to modification
and is too verbose. But hey, don't let that stop you learning your own lessons.

And there are lots of things I do like. And that'll be the focus of the conclusion of this diatribe. I leave it as an excercise to the reader to
think about their own impressions and what their own tools have taught them. In no particular order, here is a list of languages and what they've taught me:

* `C` will teach you the power of the hardware you are working with. That it is humans who fucked up the boot time and abstracted the memory and processor speeds away from you
  with their interfaces. That without it you can flip, accumulate and transform streams of simple values effortlessly. I belive it to be the closest of all languages
  to the [machines of Turing.](https://www.csee.umbc.edu/courses/471/papers/turing.pdf) It'll teach you that all human technological progress is the slow
  accumulation and integration of complex machinery. That magic is the ability to bury and marry complicated things in front of a willing participant.
  That CMOS begets bootloaders begets run levels begets networks of subsystems of countably infinite specificity. Memory layout, hierarchy and allocation

* `ASM` will teach you that despite all our efforts to invent magical things, there is a physical reality born from our actions. I thank God that
  I will not have to work with quantum machines because ELF has hammered into me a determinism in all machines. Segments and labels accumulate to
  tangible electro-mechanical effects on logic gates and shifts in latches. I still compulisvely flinch at code that might cause a spill in an instruction pipeline when
  in reality most code I write probably does already. It teaches you that optimizations are the hard-won rewards of analysis. That it is only possible
  to pass the camel through the needle if you have a sufficienlty maleable camel.

* `C++`, `Java` and `C#` will teach you that the pound of flesh, is deerely bought. Or, that when you ask for abstraction you must give up
  understanding. As you demand access to more resources without paying the price of understanding their implementation at a lower level you are
  borrowing on your ability to command them. How do you refactor a JFrame to run without Swing? Or Win32? Or Cocoa? GTK+? Wayland? Thank God for SDL!

* `Python` is the modern Basic: it will teach you clarity of algorithmic expression in procedural programming. It will sprinkle your code with readability
  and focus your effort on the problem rather than the framework. If you avoid implementing your own classes and embrace the wide community of tools for
  data processing and visualization you will find a valuable companion for thinking about algorithms.

* Python is to `Ruby` as Science is to Engineering. It is the toolbox. It is the greasy spanner, worn at the handle. It's full of standard approaches to
  implementing commercial problems: Homebrew, RSpec, Rails, RedMine, Rake. The standard library is expansive and embraces SmallTalk's mantra of complicated objects
  assembled in standard ways by knowledge workers who understand the domain. It's the first language her to actively discourage the for loop: the objects
  understand how to itterate themselves. I belive if the language were to design itself in a major way again, standard classes would be implemented as
  mixins. Objects have behaviors and components of Net::HTTP, Delegator, IO, serialization would probably be exposed as modules rather than by subclassing.
  But the collaboration of specific-purpose objects keeps class files simple. It is the busy hacker's language, sprinkled with oddities for text processing,
  regex operators, dynamic object construction, weak visibility checking, metaprogramming, 'monkey patching', method chaining and a simple threading model.
  When working with C-family languages, I miss `unless` and conditional checks placed after statment expressions ( `return false unless foo.nil?.!` ).
  Implemented as a YACC grammar, all components may be torn apart, inspected with standard tooling and customized as needed. It should be regarded as a
  great achivement of open source, along with GCC, GNU and glibc.

* If Ruby is the wrench, `JavaScript` is the chopstick: agile and infinitely useful. It can be used leveraged as a shovel, sharpened to shiv or blunted to
  a (tiny) club. There are infinitely many correct implementations of a solution. I wish to stress that I belive this to be a great thing for spreading a
  general baseline ability for programming of computers. Part of the reason for the diversity and the numbers of developers in the JS community is due to this.
  If I'm right and you are right we have a baseline for talking about more optimal solutions. However, for commercial products I belive this to be unwise as
  [*"There is a popular, widespread belief that computers can do only what they are programmed to do. This false belief is based on a confusion between
  form and content. A rigid grammar need not make for precision in describing processes"* - Minsky, 1967.](http://worrydream.com/refs/Minsky%20-%20Why%20programming%20is%20a%20good%20medium%20for%20expressing%20poorly%20understood%20and%20sloppily-formulated%20ideas.pdf)
  With the removal of simple constructs for inheritence, the user is forced to compose functionality into prototype chains. Learned from Self, this forces a
  better representation of object oriented problem solving as the combining of disparate domains leads to both little coordination between disparate behaviors
  and requires strong coordination semantics between collaborators. Whilst Go is known for the mantra "Don't communicate by sharing state, share state by
  communicating", JavaScript's annonymous and 1st classfunctions and lack of a complex type system system encourages developers to write interfaces as objects.
  Boundaries between objects are themselves objects they are unconciously developing mondic reasoning by avoiding stateful manipulation of object properties - this
  just gets too difficult in the language beyond 1 or 2 objects. As it is the lingua franca of the browser, I belive it to be closest extension of Seymour Papert's
  [power of accessibility](http://worrydream.com/refs/Papert%20-%20Whats%20the%20Big%20Idea.pdf). Through it we can immediately interact with documents that are
  otherwise oppressive and stale. We can understand the motion of the universe on the canvas and develop deeper understanding for the relationship of all things in
  3D contexts.

  ![What industry programming looks like - 3]({{ site.url }}/media/images/prog-irl-3.jpg)

* `Lisp` (Clojure/Common Lisp/Elisp) will teach you the power of a simple universal interface to computation. Throw away the brackets, embrace `paren-mode` and
  map over all the inelegance of hamming a logical problem space over an operational one. Whilst the machines we have access to may have obscurities like
  dynamically allocated memory, DATA and pointers, by appealing to a more universal notion of computability we can implement machines that shim  the logical layers of
  our systems and reason about our computations using [simple axioms of reduction and combination.](https://www.classes.cs.uchicago.edu/archive/2007/spring/32001-1/papers/church-1940.pdf)
  Opposed to the infinite specificity of the reading, erasing tape machine we can define types, statements, inference, deduction and recursion in a simple algebra that
  has universal applicability and understandability. Lisp is a great teaching language. By removing syntactical complexity, the mechanics of the machine can be studied.
  Given the simple reduction model, I find Lisp programs the easiest to debug and maintain. In practise, Lisps make for great scripting layers on top of other
  machines. Clojure takes this approach to the JVM, ClojureScript to the browser, Elisp to Emacs. Whilst I find [Paul Graham's comments on Lisp](http://www.paulgraham.com/lisp.html)
  conceited, I do wish it was more popular. For there already exists a large gap between the semantic and denotational semantics in 'lower-level' languages, why not
  exploit this for a more universal representation?

* Much like the distance between quantum mechanics and Newtonian physics, `Erlang` will teach you that in order to build software that runs quickly on many machines
  you have to ditch many of the ideas that made it run quickly on one machine. For the past decade we've only seen the continuation of Moore's Law because of
  cacheing and pipelining. C/C++ will teach you that data locality, minimizing stack frame sizes and the coordination of pointer access will lead to more efficien
  operation - do less work, with less bits, less often. However the costs of coordination across a network are far larger than on a single CPU cluster. The speed of light
  imposes fundamental limitations on any 2 node's ability to coordinate their state. Erlang is Einsteinian relativism in a programming language: given my input, I
  will deterministically perform this action or this action. With no need for Objects to coordinate access to shared memory, chains of functions operate only on their
  input. With support for pattern matching and guards and symbols it encourages the rapid development of symbolic applications. With OTP the programmer has access to
  a lot of functionality for free, hooking in to well-documented, well-tested algorithmic appliances.

* `Racket` will teach you the value of DSL's. Heavily influenced by Scheme, it encourages working with languages as primatives. While some different languages employ
  interfaces or DSL's or API's to program against specific implementations or to coordinate application domains with library concerns, Racket encourages the wholesale
  consumption and construction of languages for any purpose. By sepparating concerns along language lines, Racket focuses on providing tools for the higher level manipulation
  of semantic primatives. This mirrors the development of different technologies for the web, graphics and audio programming.

* `Go` is the neanderthal on a skateboard. Wearing the smell of ancient programming practises and scars from email flamewars about design patterns, it achieves performance
  and cross platform compatability by focusing on a small core server-side functions and operates slightly above the machine level. You get access to raw arrays, structs
  and pointers! Instead of constructing more complicated synchronization objects from these, the runtime provides you with managed green threads in the form of goroutines
  and channels. By inserting these as computational primatives, the programmer is freed from the need to spend a great deal of time analyzing the mechanism of
  interlocking cogs that turn as your program executes. The skateboard is the decision to ditch complicated C-family OO for a simple, fast interface and
  struct-based type system. Without needing academic papers or other languages as inspiration Go has forged the way for composable abstractions with embedded types.

* `PHP` is the long-dead pioneer, living and dying in the spirit of exploration. From an era when Apache and MySQL walked the Earth it was the glue between the server and the
  database. Configured with a `.ini` file it went up quickly and got you productive. With few facilities outside of returning text over a socket to an Apache thread, you needed to
  leverage your knowledge of GNU. It had ORM's and templating languages so product managers could sell CRM's and API's
  quickly. Most performant when stripped of any semblance of maintainability, with bizarre syntax and surviving the late introduction of core language features like Namespaces,
  it is useful for remembering that some of the web's most successful products didn't wait for a 'perfect' experience. Frequently, if you run with what you've got it will be
  enough to ship a Facebook or a Yahoo.

* `Haskell` is the really hot bitchy lover you can't have. The product of decades of research and papers it presents itself as a universal interface to computability.
  Decoupled type and value constructors, a brutal type system, lazy evaluation, wide applicability with many options for output; it is the holy grail of neckbeards. However,
  in this rush for ultimate control and expressibility many fail. They fail because the generality of the solution lends itself to solving problems so general they remove
  the need for programmers. If start ups really understood the power of Haskell/Idris and Category Theory they would be spend more time educating their staff and less time
  forcing them into bad habits of procedural programming. Unfortunately, we conflate effort with achivement and there is the necessary evil of needing to ship *something*.
  After years of making the same mistakes in development cycles, some developers walk the thorny path to enlightenment. In walking this road, expect set backs!
  Whilst programmers may read books and complete many problems it generally takes them a few attempts to apply the language to their work. However, eventually they realize the benefit
  that in all the previous languages
  there is an explicit translation required mathematical notation and syntax. That by removing this you do not abstract the denotational semantics but you do greatly simplified
  the syntactical distance between our **representation of thought** and our **implementation of solution**. Hindley-Milner type inference ensures unsound programs do not compile,
  Rank-N polymorphism gives productivity.

* `PureScript` is an implementation of category theory semantics atop the JavaScript VM. Whilst there is a great deal of enthusiasm around Elm, it lacks higher kinded types soa
  separate static declarations are required for Applicatives. Using Bower as the package manager, it has strong reproducability for a JS-based framework. It has a dynamic REPL
  so you get the kind of rapid prototyping, inspection and interaction that `IRB` and `clj` have made popular. It comes with great documentation that describes the runtime
  complexity of operations and should be regarded as a powerful language for constructing sophisticated browser-based applications.
