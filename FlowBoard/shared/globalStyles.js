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
  inputStyle: {
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
    flexDirection: 'row',
    width: '80%'
  },
  taskContainerItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  taskContainerContent: {
    width: '90%',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%'
  },
  modalView: {
    width: "200",
    height: '150',
    backgroundColor: "#E40763",
    borderRadius: 15,
    textAlign: 'left',
    justifyContent: 'space-evenly',
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '20'
  },
  textBtn: {
    fontSize: '14',
    color: 'white',
    fontWeight: 'bold',
    marginLeft: '5'
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
});

export default globalStyles;
