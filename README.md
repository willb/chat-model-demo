# Source-to-image for models

This is a basic demo of building a NLP model in a notebook and then deploying it using source-to-image.  While the functionality we'll implement is straightforward, this technique generalizes to more interesting models.

## Set up the chatbot

First, make sure you're logged in to OpenShift.  Then you can build the chatbot application:

`oc new-app centos/nodejs-10-centos7~https://github.com/willb/chat-model-demo/ --context-dir=bot --name=bot -e PORT=8080 && oc expose svc/bot`

Once it has built, you can interact with it via the published route.  By default, it will cheerfully just echo back your message to you.  While this is more useful than some automated systems, it's not particularly exciting.  Let's make it smarter.

## Adding some useful functionality

Whether our chatbot is fully automated or whether it's just trying to intelligently route questions to a human, we'll want to know what our interlocutor is asking about.  A good first step is using a model for named entity detection; in [this notebook](https://github.com/willb/chat-model-demo/blob/develop/notebooks/entities.ipynb), we'll use spaCy's language model to extract the named entities from a string.  We've followed some basic conventions in this notebook, like putting our requirements in a variable named `requirements`, calling our inference function `predictor`, and calling an input-validation function `validator`.  These will make it easy for our tooling to automatically transform our notebook into a model service.

## Building a basic model with source-to-image

If we're happy with the model we've built in a notebook, we can use a source-to-image build to reproducibly turn our notebook into a REST endpoint that we can integrate into a larger application.  The following build command should get it done:

`oc new-app --name model quay.io/willbenton/simple-model-s2i:notebook-s2i~https://github.com/willb/chat-model-demo/ --context-dir=notebooks --build-env S2I_SOURCE_NOTEBOOK=entities.ipynb --build-env S2I_SPACY_MODEL=en`

(It might take a while, since the build may have to build spaCy from source.)

## Telling our chatbot to use the model

Our chatbot won't do anything with the model just yet.  To make that happen, we'll need to update its environment so it knows it can call out to a model service.  We'll do that with the following command:

`oc set env dc/bot ENDPOINT=http://model:8080/predict`

Updating the deployment configuration will cause the chatbot to redeploy with the new environment.  Once you're connected again, you should be able to type in any sentence and get a list of the named entities.  

If you're interested in trying another technique, you can run the s2i build with a different notebook!
