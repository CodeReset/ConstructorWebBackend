export default {
    main: (name, type) =>{
        return `\n
        <View style={styles.container}>
          <${name} type="${type}" onClicker={testButtonFunct} />
        </View>`  
    }
};