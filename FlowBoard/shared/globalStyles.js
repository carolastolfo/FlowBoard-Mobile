import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({

  /* Kanban Style */
  safeArea: {
    width: '100%',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E5D4ED',
    alignItems: "center",
    width: '100%',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: '80%',
    marginTop: 20,
  },
  inputAddTAsk: {
    flex: 1,
    borderColor: "#ddd",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  addButton: {
    backgroundColor: "#5C60A5",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: 40,
    height: 43,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskContainer: {
    flex: 1,
    width: '80%',
    marginBottom: 60,
  },
  taskContainerItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    paddingRight: 40,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  taskContainerContent: {
    width: '90%',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10
  },
  taskText: {
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '90%',
    padding: 10,
    backgroundColor: "white",
    justifyContent: 'space-evenly',
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  headerStyle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: '#5C60A5',
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  textContent: {
    fontSize: '14',
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center'
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "gray"
  },
  buttonStyle: {
    backgroundColor: '#5C60A5',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  inputStyle: {
    // flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tagItem: {
    backgroundColor: '#ddd', 
    borderRadius: 12,       
    paddingHorizontal: 8,   
    paddingVertical: 4,      
    marginRight: 5,         
    marginBottom: 5,      
  },
});

export default globalStyles;
