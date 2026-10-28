FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/expenseflow-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD java -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar app.jar
