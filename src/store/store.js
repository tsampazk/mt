import Vue from 'vue'
import Vuex from 'vuex'
import secureHTTPService from '../services/SecureHttpService'
import authService from '../services/AuthService'

Vue.use(Vuex)

import { Loading } from 'element-ui';
let loadingInstance = Loading.service({ fullscreen: true });
const restapi = ''   

let errorHTML = `
<div style="padding-top:50px;">
    <h1 style="font-size:28px">We couldn't load the presentation videos</h1>
    <p style="padding-top:5px; font-size:18px">Please contact your administrator</p>
</div>
`

export const store = new Vuex.Store({
    state: {
        videos: [],
        videoAnnotations: [],
        classes: [],
        canons: [   
            { 
                name: 'Invention', 
                categories: [
                    { 
                        name: 'Appeals',
                        mvs: [
                            { desc: 'Logos: Appeals to reason or logic, including appeals to statistics, math, logic, order, and \"objectivity.\"' },
                            { desc: 'Pathos: Appeals to human emotion, desire, or passion' },
                            { desc: 'Ethos: Appeals to the character or authority of the speaker (situated or invented)' }
                        ]
                    },
                    { 
                        name: 'Kairos',
                        mvs: [
                            { desc: 'Exigence (situation-driven): Recent events to show urgency or relevance to the present' },
                            { desc: 'Audience-speaker relationship at the moment' },
                            { desc: 'Alignment to communities taking positions and serving a set of interests' },
                            { desc: 'Power dynamics between communities or groups ' },
                            { desc: 'Preferred or appropriate lines of argument, given the audience’s values/needsy' }
                        ]
                    },
                    { 
                        name: 'Stasis',
                        mvs: [
                            { desc: 'Fact (conjecture)' },
                            { desc: 'Definition' },
                            { desc: 'Causation' },
                            { desc: 'Quality (value)' },
                            { desc: 'Policy' },
                            { desc: 'Place (forum)' },
                        ]
                    },
                    { 
                        name: 'Topoi',
                        mvs: [
                            { desc: 'Comparative' },
                            { desc: 'Causal' },
                            { desc: 'Dimensional' }
                        ]
                    },
                    { 
                        name: 'Extrinsic proof',
                        mvs: [
                            { desc: 'Testimony' },
                            { desc: 'Data'}
                        ]
                    }
                ]
            },
            { 
                name: 'Structure', 
                categories: [
                    { 
                        name: 'Terms',
                        desc: 'Provides overview of the talk, emphasizing the connection between key terms and concepts'
                    },
                    { 
                        name: 'Conceptual transitions',
                        desc: 'Uses conceptual transitions to connect key sections of the presentation'
                    },
                    { 
                        name: 'Line of argument',
                        desc: 'Provides a clear line of argument which is brought to a clear position at the end'
                    },
                    { 
                        name: 'Central moves',
                        desc: 'Uses the central rhetorical moves for each section appropriately '
                    }
                    ]
            },
            { 
                name: 'Delivery', 
                categories: [
                    { 
                        name: 'Volume',
                        desc: 'Volume, rate, and pitch are appropriate and modulated'
                    },
                    { 
                        name: 'Gestures',
                        desc: 'Gestures, eye contact, and body movement used intentionally to engage audience'
                    },
                    { 
                        name: 'Metadiscourse',
                        desc: 'Metadiscourse orients listener and helps transition between sections'
                    },
                    { 
                        name: 'Posture',
                        desc: 'Posture and stance project confidence, and allow speaker to interact with audience and screen'
                    },
                    { 
                        name: 'Language',
                        desc: 'Technical and informal language are both employed as appropriate'
                    }
                ]
            },
            { 
                name: 'Visuals', 
                categories: [
                    { 
                        name: 'Pictorial cues',
                        desc: 'Uses primarily pictorial cues (limited text)'
                    },
                    { 
                        name: 'Slide titles',
                        desc: 'Uses assertion-based slide titles to convey key concepts (including title slide)'
                    },
                    { 
                        name: 'Image-text highlight',
                        desc: 'Images and text highlight/focus audience on key points'
                    },
                    { 
                        name: 'Graphics',
                        desc: 'Graphics show relevant data/concepts to support the claims'
                    },
                    { 
                        name: 'Memorable images',
                        desc: 'Memorable images provide necessary context to support the oral discussion'
                    }
                ]
            },
            { 
                name: 'Style', 
                categories: [
                    { 
                        name: 'Coherence ',
                        desc: 'Uses transitions at the sentence level to connect key concepts and parts of the argument'
                    },
                    { 
                        name: 'Concision',
                        desc: 'Uses the fewest possible words to explain the concepts for the audience, avoiding unnecessary repetition'
                    },
                    { 
                        name: 'Flow',
                        desc: 'Uses structures such as given/new or three-part structures to help the audience follow the argument'
                    },
                    { 
                        name: 'Emphasis',
                        desc: 'Uses specific words or phrases to draw attention to important concepts'
                    },
                    { 
                        name: 'Figures of Speech',
                        desc: 'Uses analogies, metaphors or other rhetorical devices to enhance the concepts and make the speech memorable'
                    },
                    { 
                        name: 'Figures of Sound',
                        desc: 'Uses auditory cues at the sentence (e.g. patterned parallelism) or word level (e.g. alliteration) to make the oral delivery more memorable'
                    }
                ]
            }
        ],
        categories: [],
        genres: [],
        departments: [],
        // The currently selected class 
        currentClass: { 
            name:'Home', 
            id: '',
            number: '',
            department: ''
        },
        currentVideoID: null,
        uploadingVideo: false,
        uploadUrl: '',
        assignments: [],
        collaborators: [],
        users: [],
        // ENROLLMENTS
        enrollments: [], // All enrollments
        enrolledUsers: [], // TODO THIS WILL BE REFACTORED OUT, IT'S CURRENTLY USED IN COLLABORATORS
        // For Student
        userEnrollments: [], // Current student's enrollments
        enrolledClasses: [] // Current student's classes (both accepted/not accepted)
    },

    actions: {
        /* VIDEOS  */
        getAllVideos: function ({ commit }) {
            secureHTTPService.get("video")
                .then(function (response)
                {
                    commit('GET_ALL_VIDEOS', response.data.data )
                })
                .catch(function (err) {
                    $('.home').html(errorHTML)
                })
        },
        getVideo: function ({ commit }, payload) {
            secureHTTPService.get("video/" + payload)
                .then(function (response)
                {
                    commit('GET_VIDEO', response.data.data)
                })
                .catch(function (err) {
                    $('.video').html(errorHTML)
                })
        },
        createVideo: function ({ commit, dispatch }, payload) {
            secureHTTPService.post("video", payload)
                .then( response => {
                    console.log('-----')
                    console.log('POST video')
                    commit('CREATE_VIDEO', response.data.data)
                    dispatch( 'createCollaboration', { videoId: response.data.data.id, userId: authService.getAuthData().userId } )
                })
                .catch( response => {
                    console.log('createVideo action error.')
                    console.log('payload: ', payload)
                    console.log('error:', response.error)
                })
        },
        editVideo: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.videoId, payload.videoBody)
                .then( response => {
                    console.log('PUT video')
                    commit('EDIT_VIDEO', payload.videoBody)
                })
                .catch( function(err) {
                    console.log(err)
                    console.log('videoBody: ', payload.videoBody)
                })
        },
        deleteVideo: function ({ commit }, payload) {
            secureHTTPService.delete("video/" + payload)
                .then( response => {
                    console.log('-----')
                    console.log('DELETE video')
                    commit('DELETE_VIDEO', payload)
                })
                .catch( response => console.log(response.error))
        },
        featureVideo: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.id, payload)
                .then( response => {
                    console.log("store.js: Video object that sent: ", payload)
                    console.log(response)
                })
                .catch( response => console.log(response.error))
        },
        featureGlobal: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.id, payload)
                .then( response => {
                    console.log("store.js: Video object that sent: ", payload)
                    console.log(response)
                })
                .catch( response => console.log(response.error))
        },
        unfeatureGlobal: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.id, payload)
                .then( response => {
                    console.log("store.js: Video object that sent: ", payload)
                    console.log(response)
                })
                .catch( response => console.log(response.error))
        },
        unfeatureVideo: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.id, payload)
            .then( response => {
                console.log("store.js: Video object that sent: ", payload)
                console.log(response)
            })
            .catch( response => console.log(response.error))
        },
        /* ANNOTATIONS */
        getVideoAnnotations: function ({ commit, state }, payload) {
            secureHTTPService.get("annotation/?videoId=" + payload)
                .then(function (response)
                {
                    commit( 'GET_VIDEO_ANNOTATIONS', response.data.data )
                    state.videoAnnotations.sort(function(a,b) {return (a.from > b.from) ? 1 : ((b.from > a.from) ? -1 : 0);} );
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        addAnnotation: function ({ commit, state }, payload) {
            secureHTTPService.post("annotation/?videoId=" + payload.videoId, payload)
                .then(response => {
                    commit('ADD_ANNOTATION', response.data.data)
                })
                .catch(function (err) {
                    console.log('Error annotation add...', err)
                })
        },
        editAnnotation: function ({ commit }, payload) {            
            secureHTTPService.put("video/" + payload.id, payload.video)
                .then(response => {
                })
                .catch(function (err) {
                    console.log('Error annotation edit...', err)
                })
        },
        deleteAnnotation: function ({ commit }, payload) {           
            secureHTTPService.delete("annotation/" + payload) // payload is the cardID
                .then(response => {
                    commit('DELETE_ANNOTATION', payload)
                    // theVideo.annotations.sort(function(a,b) {return (a.from > b.from) ? 1 : ((b.from > a.from) ? -1 : 0);} );                    
                })
                .catch(function (err) {
                    console.log('Error annotation delete...', err)
                })
        },
        /* CLASSES */  
        getAllClasses: function ({ commit }) {
            return secureHTTPService.get("class/")
                .then(function (response)
                {
                    // console.log("getAllClasses action")
                    commit('GET_ALL_CLASSES', response.data.data)
                    commit('FILL_DEPARTMENTS')
                })
                .catch(function (err) {
                    $('.classes').html(errorHTML)
                })
        },
        // getClass: function ({ commit }, payload) {
        //     secureHTTPService.get("class/" + payload)
        //         .then(function (response)
        //         {
        //             commit('GET_CLASS', response.data.data )
        //         })
        //         .catch(function (err) {
        //             console.log(err)
        //         })
        // },
        createClass: function ({ commit }, payload) {
            return secureHTTPService.post("class/", payload.newClass)
            .then(response => {
                commit('CREATE_CLASS', response.data.data)
                return response
            })
            .catch(function (err) {
                console.log('createClass POST error: ', err)
            })
        },
        deleteClass: function ({ commit }, payload) {
            return secureHTTPService.delete("class/" + payload)
            .then(response => {
                commit('DELETE_CLASS', payload)
            })
            .catch(function (err) {
                console.log('deleteClass DELETE error: ', err)
            })
        },
        archiveClass: function ({ commit }, payload) {
            return secureHTTPService.put("class/" + payload.classId, payload.classObject)
            .then(response => {
                // pass through
            })
            .catch(function (err) {
                console.log('archiveClass PUT error: ', err)
            })
        },
        unArchiveClass: function ({ commit }, payload) {
            return secureHTTPService.put("class/" + payload.classId, payload.classObject)
            .then(response => {
                // pass through
            })
            .catch(function (err) {
                console.log('unarchiveClass PUT error: ', err)
            })
        },
        /* ENROLLMENTS */ 
        createEnrollment: function ({ commit }, payload) {
            return secureHTTPService.post("enrollment", payload)
                .then(function(response){
                    commit('CREATE_ENROLLMENT', response.data.data)
                })
                .catch(function(err) {
                    console.log("createEnrollment PUT error: ", err)
                })
        },
        getAllEnrollments: function ({ commit }, payload) {
            return secureHTTPService.get("enrollment")
                .then(function (response)
                {
                    // console.log("getAllEnrollments action")
                    commit('GET_ENROLLMENTS', response.data.data)
                })
                .catch(function (err) {
                    
                })
        },
        getAllUserEnrollmentsByUserId: function ({ commit }, payload) {
            return secureHTTPService.get("enrollment?userId=" + payload)
                .then(function (response)
                {
                    // var enrolledClassIds = []
                    // var enrollments = response.data.data
                    // for (var i = 0, l = enrollments.length; i < l; i++) {
                    //     if (enrollments[i].accepted){
                    //         enrolledClassIds.push(enrollments[i].classId)
                    //     }
                    // }
                    // commit( 'CREATE_STUDENT_CLASSES', enrolledClassIds)
                    
                    // console.log("getAllUserEnrollmentsByUserId action")
                    commit('GET_USER_ENROLLMENTS', response.data.data)
                })
        },
        getEnrolledClassesByUserId: function ({ commit }, payload) {
            return secureHTTPService.get("enrolledClass?userId=" + payload)
            .then(function (response)
            {
                commit('GET_ENROLLED_CLASSES', response.data.data)
            })
        },
        getEnrolledUsersByClassId: function ({ commit }, payload) {
            return secureHTTPService.get("enrolledUser?classId=" + payload)
            .then(function (response)
            {
                var responseObj = {data: response.data.data, classId: payload}
                commit('GET_ENROLLED_USERS', responseObj)
            })
        },
        /* ASSIGNMENTS */ 
        getAssignments: function ({ commit }, payload) {
            return secureHTTPService.get("assignment?classId=" + payload)
            .then(function (response)
            {
                commit('GET_ASSIGNMENTS', response.data.data)
            })
            .catch(function (err) {
                console.log('getAssignments GET error: ', err)
            })
        },
        createAssignment: function ({ commit }, payload) {
            return secureHTTPService.post("assignment", payload)
            .then(function (response)
            {
                commit('CREATE_ASSIGNMENT', response.data.data)
            })
            .catch(function (err) {
                console.log('createAssignment POST error: ', err)
            })
        },
        editAssignment: function ({ commit }, payload) {
            console.log('editAssignment()')
            console.log(payload.assignment)
            secureHTTPService.put("assignment/" + payload.id, payload.assignment)
                .then(function (response)
                {
                    console.log(response)
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        deleteAssignment: function ({ commit }, payload) {
            secureHTTPService.delete("assignment/" + payload)
                .then(function (response)
                {
                    commit('DELETE_ASSIGNMENT', payload)
                })
                .catch(function (err) {
                    
                })
        },
        /* GENRES */ 
        getGenres: function ({ commit }) {
            secureHTTPService.get("genre")
                .then(function (response)
                {
                    commit('GET_GENRES', response.data.data)
                })
                .catch(function (err) {
                    
                })
        },
        /* CATEGORIES */ 
        getCategories: function ({ commit }) {
            secureHTTPService.get("category")
                .then(function (response)
                {
                    commit('GET_CATEGORIES', response.data.data)
                })
                .catch(function (err) {
                    
                })
        },
        /* COLLABORATORS */ 
        getCollaborators: function ({ commit }, payload) {
            secureHTTPService.get("collaborator?videoId=" + payload)
                .then(function (response)
                {
                    commit('GET_COLLABORATORS', response.data.data)
                })
                .catch(function (err) {
                    
                })
        },
        createCollaboration: function ({ commit, dispatch }, payload) {
            secureHTTPService.post("collaboration", payload)
                .then(function (response)
                {
                    dispatch('getCollaborators', payload.videoId)
                })
                .catch(function (err) {
                    
                })
        },
        deleteCollaboration: function ({ commit, dispatch }, payload) {
            secureHTTPService.get("collaboration")
                .then(function (response)
                {
                    var collaborations = response.data.data

                    for (var i = 0, l = collaborations.length; i < l; i++) {
                        if (collaborations[i].videoId === payload.videoId && collaborations[i].userId === payload.userId) {
                            secureHTTPService.delete("collaboration/" + collaborations[i].id)
                                .then(function (response)
                                {
                                    console.log('deleted collaboration: ')
                                    dispatch('getCollaborators', payload.videoId)
                                })
                        }
                    } 
                    

                })
        },
        /* USERS */ 
        getUsers: function ({ commit }, payload) {
            secureHTTPService.get("user")
                .then(function (response)
                {
                    commit('GET_USERS', response.data.data)
                })
                .catch(function (err) {
                    
                })
        }
    },

    mutations: {
        /* VIDEOS */
        GET_ALL_VIDEOS: (state, newVideos) => {
            loadingInstance.close()
            state.videos = newVideos
            state.videos.sort(function(a,b) {return (a.presentedAt < b.presentedAt) ? 1 : ((b.presentedAt < a.presentedAt) ? -1 : 0);} );
            for (var i = 0, l = state.videos.length; i < l; i++) {
                Vue.set(state.videos[i], 'featured', false)
            }
        },
        GET_VIDEO: (state, video) => {
            loadingInstance.close()
            state.videos = video
        },
        CREATE_VIDEO: (state, payload) => {
            var videos = state.videos
            videos.push(payload)
        },
        EDIT_VIDEO: (state, payload) => {
            state.videos.link = payload.link
            state.videos.duration = payload.duration
            state.videos.status = payload.status
        },
        DELETE_VIDEO: (state, payload) => {
            var videos = state.videos
            for (var i=0, l = annotations.length; i < l; i++) {
                if (videos[i].id === payload.video.id)
                    videos.splice(i, 1)              
            }
        },
        // Not used.
        GET_CLASS_VIDEOS: (state, classTitle) => {
            for (var i=0, l = state.videos.length; i < l; i++) {
                if (state.videos[i].class !== classTitle) 
                    state.videos.splice(i,1)
            }
        },
        // Not used.
        CREATE_UPLOAD_URL: (state, payload) => {      
            state.uploadUrl = payload.link.protocol + '://' + payload.link.address + payload.link.path + '?api_format=xml&key=' + payload.link.query.key + '&token=' + payload.link.query.token
        },
        /* ANNOTATIONS */
        GET_VIDEO_ANNOTATIONS: (state, newAnnotations) => {
            state.videoAnnotations = newAnnotations
        },
        ADD_ANNOTATION: (state, payload) => {
            state.videoAnnotations.push(payload)
        },
        EDIT_ANNOTATION: (state, payload) => {
            var currentAnnotation = state.videos[payload.id].annotations[payload.cardID]
            var annotations = state.videos[payload.id].annotations
            
            currentAnnotation.rating = payload.rating
            currentAnnotation.comment = payload.comment
            currentAnnotation.from = payload.from
            currentAnnotation.to = payload.to
            
            // Sorting annotations[] by from property
            annotations.sort(function(a,b) {return (a.from > b.from) ? 1 : ((b.from > a.from) ? -1 : 0);} );
            
            secureHTTPService.put("video/" + payload.id)
            .then(response => {
                console.log(payload.videoObj)
                console.log('Success edit!')
            })
            .catch(function (err) {
                console.log('Error annotation edit...')
            })
        },
        DELETE_ANNOTATION: (state, payload) => {
            for (var i = 0, l = state.videoAnnotations.length; i < l; i++) {
                if (state.videoAnnotations[i].id === payload) {
                    state.videoAnnotations.splice(i, 1)
                }
            } 
        },
        SORT_ANNOTATIONS: (state) => {
            var annotations = state.videos.annotations
            annotations.sort(function(a,b) {return (a.from > b.from) ? 1 : ((b.from > a.from) ? -1 : 0);} );
        },
        /* CLASSES */ 
        GET_ALL_CLASSES: (state, theClasses) => {
            loadingInstance.close()
            state.classes = theClasses
        },
        GET_CLASS: (state, theClass) => {
            loadingInstance.close()
            state.classes = theClass
        },
        CREATE_CLASS: (state, payload) => {
            state.classes.push(payload)
        },
        // Only for admin.
        DELETE_CLASS: (state, payload) => {
            for (var i = 0, l = state.classes.length; i < l; i++) {
                if (state.classes[i].id === payload) {
                    state.classes.splice(i, 1)              
                }
            }
        },
        // ADMIN
        // CREATE_ADMIN_CLASSES: (state) => {
        //     state.adminClasses = []
        //     for (var i = 0, l = state.classes.length; i < l; i++) {
        //         state.adminClasses.push(state.classes[i])
        //     }
        // },
        // PROFESSOR
        // CREATE_ACTIVE_ARCHIVED_CLASSES: (state) => {
        //     state.activeClasses = []
        //     state.archivedClasses = []
        //     for (var i = 0, l = state.classes.length; i < l; i++) {
        //         if (state.classes[i].professorId === authService.getAuthData().userId) {
        //             if (state.classes[i].archived === false)
        //                 state.activeClasses.push(state.classes[i])
        //             else
        //                 state.archivedClasses.push(state.classes[i])
        //         }
        //     }
        // },
        FILL_DEPARTMENTS: (state) => {
            for (var i = 0, l = state.classes.length; i < l; i++) {
                if (!state.departments.includes(state.classes[i].department))
                    state.departments.push(state.classes[i].department)
            }
        },
        SET_UPLOAD_URL: (state, payload) => {
            state.uploadUrl = payload
        },
        CURRENT_CLASS_SELECT: (state, payload) => {
            state.currentClass.name = payload.className
            state.currentClass.id = payload.classId
            state.currentClass.number = payload.classNumber
            state.currentClass.department = payload.classDepartment
        },
        /* ENROLLMENTS */
        GET_ENROLLED_USERS: (state, payload) => {
            var enrolledUsersInThisClass = payload.data // All users that have enrolled, including the not yet accepted enrollments
            var activeEnrolledUsers = [] // The users that have been accepted in this class
            var inactiveEnrolledUsers = [] // The users that have requested enrollement but have not been accepted in this class
            // console.log(enrolledUsersInThisClass)
            for (var i = 0; i < enrolledUsersInThisClass.length; i++) {
                for(var j = 0; j < state.enrollments.length; j++){
                    // UserId must be found in enrollments and the classId of that enrollment must be the current class
                    if (state.enrollments[j].userId === enrolledUsersInThisClass[i].id && state.enrollments[j].classId === payload.classId){
                        // The enrollment should be in accepted status or else the user is not considered "enrolled"/active
                        if (state.enrollments[j].accepted){
                            activeEnrolledUsers.push(enrolledUsersInThisClass[i])
                        }
                        else {
                            inactiveEnrolledUsers.push(enrolledUsersInThisClass[i])
                        }
                    }
                }
            }
            // console.log(activeEnrolledUsers)
            state.enrolledUsers = activeEnrolledUsers
        },
        GET_ENROLLED_CLASSES: (state, enrolledClasses) => {
            state.enrolledClasses = enrolledClasses
        },
        CREATE_ENROLLMENT: (state, newEnrollment) => {
            state.enrollments.push(newEnrollment)
            state.userEnrollments.push(newEnrollment)
        },
        /* ASSIGNMENTS */
        GET_ASSIGNMENTS: (state, assignments) => {
            state.assignments = assignments
        },
        CREATE_ASSIGNMENT: (state, newAssignment) => {
            state.assignments.push(newAssignment)
        },
        DELETE_ASSIGNMENT: (state, assignmentIdToBeDeleted) => {
            for (var i = 0, l = state.assignments.length; i < l; i++) {
                if (state.assignments[i].id === assignmentIdToBeDeleted) 
                    state.assignments.splice(i,1)
            }
        },
        /* GENRES */
        GET_GENRES: (state, genres) => {
            state.genres = genres
        },
        /* CATEGORIES */
        GET_CATEGORIES: (state, categories) => {
            state.categories = categories
        },
        /* COLLABORATORS */
        GET_COLLABORATORS: (state, collaborators) => {
            state.collaborators = collaborators
        },
        /* USERS */
        GET_USERS: (state, users) => {
            state.users = users
        },
        /* ENROLLMENTS */
        GET_ENROLLMENTS: (state, enrollments) => {
            state.enrollments = enrollments
        },
        GET_USER_ENROLLMENTS: (state, userEnrollments) => {
            state.userEnrollments = userEnrollments
        }
    },

    getters: {
        videos: state => {
            return state.videos
        },
        videoAnnotations: state => {
            return state.videoAnnotations
        },
        classes: state => {
            return state.classes
        },
        assignments: state => {
            return state.assignments
        },
        genres: state => {
            return state.genres
        },
        categories: state => {
            return state.categories
        },
        collaborators: state => {
            return state.collaborators
        },
        users: state => {
            return state.users
        },
        enrolledUsers: state => {
            return state.enrolledUsers
        },
        enrollments: state => {
            return state.enrollments
        },
        userEnrollments: state => {
            return state.userEnrollments
        },
        currentVideoID: state => {
            return state.currentVideoID
        },
        canons: state => {
            return state.canons
        },
        departments: state => {
            return state.departments
        },
        currentClass: state => {
            return state.currentClass
        },
        uploadVideoProps: state => {
            return state.uploadVideoProps
        },
        uploadUrl: state => {
            return state.uploadUrl
        },
        uploadingVideo: state => {
            return state.uploadingVideo
        }
    }
})